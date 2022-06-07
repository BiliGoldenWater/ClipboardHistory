/*
 * Copyright 2021-2022 Golden_Water
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {
  app,
  BrowserWindow,
  globalShortcut,
  ipcMain,
  Menu,
  nativeImage,
  Tray,
  screen as electronScreen,
} from "electron";
import * as path from "path";
import { ClipboardUtils } from "./utils/ClipboardUtils";
import { TClipboardItem } from "../shared/type/TClipboardItem";

export const isDev = !app.isPackaged;

const mainWindowIndex = isDev
  ? path.join("http://localhost:3000", "index.html")
  : path.join(app.getAppPath(), "app", "renderer", "main", "index.html");
const preloadPath = isDev
  ? path.join(app.getAppPath(), "preload.js")
  : path.join(app.getAppPath(), "app", "preload.js");

let mainWindow: BrowserWindow = null;

function createMainWindow() {
  if (mainWindow && !mainWindow.isDestroyed()) {
    mainWindow.close();
  }

  const cursorPoint = electronScreen.getCursorScreenPoint();
  mainWindow = new BrowserWindow({
    height: 400,
    width: 280,
    x: cursorPoint.x,
    y: cursorPoint.y,
    transparent: true,
    frame: false,
    autoHideMenuBar: true,
    hasShadow: false,
    webPreferences: {
      preload: preloadPath,
    },
  });

  mainWindow.setAlwaysOnTop(true, "pop-up-menu");
  mainWindow.setVisibleOnAllWorkspaces(true, {
    visibleOnFullScreen: true,
    skipTransformProcessType: false,
  });

  function onload() {
    mainWindow?.focus();
  }

  if (isDev) {
    mainWindow.loadURL(mainWindowIndex).then(onload.bind(this));
  } else {
    mainWindow.loadFile(mainWindowIndex).then(onload.bind(this));
  }

  if (!isDev) {
    mainWindow.on("blur", () => {
      mainWindow?.close();
      mainWindow = null;
    });
  }
}

function init() {
  console.log("[index.app.on.ready] ready");

  ClipboardUtils.init();

  const icon = nativeImage.createFromPath(
    isDev
      ? path.join(app.getAppPath(), "icon.png")
      : path.join(app.getAppPath(), "app", "icon.png")
  );
  const tray = new Tray(icon.resize({ width: 16, height: 16 }));
  const menu = Menu.buildFromTemplate([
    {
      label: "Quit",
      type: "normal",
      click: () => {
        app.quit();
      },
    },
  ]);
  tray.setContextMenu(menu);

  globalShortcut.register("Control+V", () => {
    createMainWindow();
  });

  if (process.platform === "darwin") app.dock.hide();

  ipcMain.on("history", (event, ...args) => {
    let returnValue: TClipboardItem[] | string = "";
    switch (args[0]) {
      case "get": {
        returnValue = ClipboardUtils.history;
        break;
      }
      case "remove": {
        ClipboardUtils.remove(args[1]);
        break;
      }
      case "clear": {
        ClipboardUtils.clear();
        break;
      }
      case "copy": {
        ClipboardUtils.copy(args[1]);
        break;
      }
      case "copyPlainText": {
        ClipboardUtils.copyPlainText(args[1]);
        break;
      }
    }
    event.returnValue = returnValue;
  });
}

if (!app.requestSingleInstanceLock()) {
  app.quit();
} else {
  // This method will be called when Electron has finished
  // initialization and is ready to create browser windows.
  // Some APIs can only be used after this event occurs.
  app.on("ready", init.bind(this));

  app.on("window-all-closed", () => {});

  app.on("activate", () => {
    // On OS X it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    console.log("[index.app.on.activate] activate");
  });

  app.on("quit", () => {
    console.log("[index.app.on.quit] quit");
    ClipboardUtils.stop();
  });
}
