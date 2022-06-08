/*
 * Copyright 2021-2022 Golden_Water
 * SPDX-License-Identifier: AGPL-3.0-only
 */
import { clipboard, nativeImage } from "electron";
import "crypto";
import * as crypto from "crypto";
import { TClipboardItem } from "../../shared/type/TClipboardItem";
import parse from "node-html-parser";

export class ClipboardUtils {
  static history: TClipboardItem[] = [];
  static loop: NodeJS.Timeout;

  static init() {
    this.update();
  }

  private static update() {
    let isImage = false;

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
      isImage = true;
    } else if (formats.includes("text/html")) {
      item.type = "text/html";
      item.value = parse(clipboard.readHTML()).querySelector("body").toString();
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

    if (isImage) {
      this.loop = setTimeout(this.update.bind(this), 2e3);
    } else {
      this.loop = setTimeout(this.update.bind(this), 100);
    }
  }

  static stop() {
    clearInterval(this.loop);
  }

  static getHistory(hadItemUUIDs: string[]): TClipboardItem[] {
    return this.history.map((value) => {
      if (hadItemUUIDs.indexOf(value.uuid) === -1) return value;

      return {
        ...value,
        value: "",
      };
    });
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
        clipboard.write({
          html: value.value,
          text: value.plainText !== "" ? value.plainText : undefined,
        });
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
