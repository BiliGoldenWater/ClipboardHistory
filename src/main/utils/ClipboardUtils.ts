/*
 * Copyright 2021-2022 Golden_Water
 * SPDX-License-Identifier: AGPL-3.0-only
 */
import { clipboard, nativeImage } from "electron";
import "crypto";
import * as crypto from "crypto";
import { TClipboardItem } from "../../shared/type/TClipboardItem";

export class ClipboardUtils {
  static history: TClipboardItem[] = [];
  static loop: NodeJS.Timer;

  static init() {
    this.loop = setInterval(this.update.bind(this), 1e3);
  }

  private static update() {
    const item: TClipboardItem = {
      uuid: crypto.randomUUID(),
      type: "text/plain",
      value: "",
      plainText: "",
    };

    const formats = clipboard.availableFormats();
    if (formats.includes("image/png")) {
      item.type = "image/png";
      item.value = clipboard.readImage().toDataURL();
    } else if (formats.includes("text/html")) {
      item.type = "text/html";
      item.value = clipboard.readHTML();
    } else if (formats.includes("text/plain")) {
      item.value = clipboard.readText();
    }
    item.plainText = clipboard.readText();

    const lastItem: TClipboardItem =
      this.history.length > 0
        ? this.history[this.history.length - 1]
        : { uuid: "0", type: "text/plain", value: "", plainText: "" };

    if (lastItem.type !== item.type || lastItem.value !== item.value) {
      this.history = this.history.filter(
        (value) => value.type !== item.type || value.value !== item.value
      );
      this.history.push(item);
      console.log(`[ClipboardUtils.update.newItem] ${formats}`);
    }

    if (this.history.length > 100) {
      this.history.shift();
    }
  }

  static stop() {
    clearInterval(this.loop);
  }

  static remove(uuid: string) {
    this.history = this.history.filter((value) => value.uuid !== uuid);
  }

  static clear() {
    this.history = [];
  }

  static copy(uuid: string) {
    const value = this.history.find((value) => value.uuid === uuid);
    if (!value) return;
    switch (value.type) {
      case "text/plain": {
        clipboard.writeText(value.value);
        break;
      }
      case "text/html": {
        clipboard.write({ html: value.value, text: value.plainText });
        break;
      }
      case "image/png": {
        clipboard.writeImage(nativeImage.createFromDataURL(value.value));
        break;
      }
    }
  }

  static copyPlainText(uuid: string) {
    const value = this.history.find((value) => value.uuid === uuid);
    if (!value) return;
    clipboard.writeText(value.plainText);
  }
}
