/*
 * Copyright 2021-2022 Golden_Water
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import React, { ReactNode } from "react";
import "./ClipboardItem.less";
import { TClipboardItem } from "../../../../shared/type/TClipboardItem";
import { DeleteOutlined, FileTextOutlined } from "@ant-design/icons";

class Props {
  item: TClipboardItem;
  deletable: boolean;
}

export class ClipboardItem extends React.Component<Props> {
  render(): ReactNode {
    const {
      item: { type, uuid, value, plainText },
      deletable,
    } = this.props;

    let item;

    switch (type) {
      case "text/html": {
        if (plainText !== "") item = <div>{plainText}</div>;
        else item = <div dangerouslySetInnerHTML={{ __html: value }} />;
        break;
      }
      case "text/plain": {
        item = <div>{value}</div>;
        break;
      }
      case "image/png": {
        item = (
          <img style={{ width: "100%" }} src={value} alt={"unable to load"} />
        );
        break;
      }
    }

    return (
      <div
        className={"ClipboardItem"}
        draggable
        onDragStart={(event) => {
          const dataTransfer = event.dataTransfer;
          dataTransfer.effectAllowed = "copy";
          dataTransfer.dropEffect = "copy";

          switch (type) {
            case "text/html": {
              if (plainText !== "")
                dataTransfer.setData("text/plain", plainText);
              else dataTransfer.setData("text/plain", value);
              break;
            }
            case "text/plain": {
              dataTransfer.setData("text/plain", value);
              break;
            }
          }
        }}
        onClick={() => {
          window.electron.copyItem(uuid);
        }}
      >
        <div className={"ClipboardItemContent"}>{item}</div>
        <div className={"ClipboardItemControls"}>
          {deletable && (
            <div
              className={"ClipboardItemControlItem"}
              onClick={() => {
                window.electron.removeHistory(uuid);
              }}
            >
              <DeleteOutlined />
            </div>
          )}
          {plainText !== "" && (
            <div
              className={"ClipboardItemControlItem"}
              onClick={() => {
                window.electron.copyPlainText(uuid);
              }}
            >
              <FileTextOutlined />
            </div>
          )}
        </div>
      </div>
    );
  }
}
