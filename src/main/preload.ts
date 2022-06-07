/*
 * Copyright 2021-2022 Golden_Water
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {TClipboardItem} from "../shared/type/TClipboardItem";
import {contextBridge, ipcRenderer} from "electron";

export interface ApiElectron {
  getHistory: () => TClipboardItem[];
  removeHistory: (uuid: string) => void;
  clearHistory: () => void;
  copyItem: (uuid: string) => void;
  copyPlainText: (uuid: string) => void;
}

const apiElectron: ApiElectron = {

  getHistory(): TClipboardItem[] {
    return ipcRenderer.sendSync("history", "get");
  },
  removeHistory(uuid: string): void {
    ipcRenderer.sendSync("history", "remove", uuid);
  },
  clearHistory(): void {
    ipcRenderer.sendSync("history", "clear");
  },
  copyItem(uuid: string): void {
    ipcRenderer.sendSync("history", "copy", uuid);
  }, copyPlainText(uuid: string): void {
    ipcRenderer.sendSync("history", "copyPlainText", uuid)
  },
};

contextBridge.exposeInMainWorld("electron", apiElectron);

declare global {
  interface Window {
    electron: ApiElectron;
  }
}
