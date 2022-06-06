/*
 * Copyright 2021-2022 Golden_Water
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { app, BrowserWindow } from "electron";
import * as path from "path";

export const isDev = !app.isPackaged;

const mainWindowIndex = isDev
  ? path.join("http://localhost:3000", "index.html")
  : path.join(app.getAppPath(), "app", "renderer", "main", "index.html");

app.on("ready", () => {});
let mainWindow: BrowserWindow = null;

function createMainWindow() {
  mainWindow?.close();
  mainWindow = new BrowserWindow();

  if (isDev) {
    mainWindow.loadURL(mainWindowIndex).then();
  } else {
    mainWindow.loadFile(mainWindowIndex).then();
  }
}

if (!app.requestSingleInstanceLock()) {
  app.quit();
} else {
  // This method will be called when Electron has finished
  // initialization and is ready to create browser windows.
  // Some APIs can only be used after this event occurs.
  app.on("ready", () => {
    console.log("[index.app.on.ready] ready");
    createMainWindow();
  });

  // Quit when all windows are closed, except on macOS. There, it's common
  // for applications and their menu bar to stay active until the user quits
  // explicitly with Cmd + Q.
  app.on("window-all-closed", () => {
    console.log("[index.app.on.window-all-closed] window-all-closed");
    if (process.platform !== "darwin") {
      app.quit();
    }
  });

  app.on("activate", () => {
    // On OS X it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    console.log("[index.app.on.activate] activate");
    createMainWindow();
  });

  app.on("quit", () => {
    console.log("[index.app.on.quit] quit");
  });
}
