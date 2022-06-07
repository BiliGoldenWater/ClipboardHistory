/*
 * Copyright 2021-2022 Golden_Water
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import React, { ReactNode } from "react";
import "./Main.less";
import { TClipboardItem } from "../../../shared/type/TClipboardItem";
import { ClipboardItem } from "./clipboardItem/ClipboardItem";
import { DeleteOutlined } from "@ant-design/icons";

class Props {}

class State {
  history: TClipboardItem[];
}

export class Main extends React.Component<Props, State> {
  loopId: number;

  constructor(props: Props) {
    super(props);

    this.state = {
      history: window.electron.getHistory(),
    };

    this.loopId = window.setInterval(() => {
      this.setState({ history: window.electron.getHistory() });
    }, 1e3);
  }

  componentWillUnmount() {
    window.clearInterval(this.loopId);
  }

  render(): ReactNode {
    const { history } = this.state;

    return (
      <div className={"Main"}>
        <div className={"MainHistoryControls"}>
          <div
            className={"MainHistoryControlItem"}
            onClick={window.electron.clearHistory}
          >
            <DeleteOutlined />
          </div>
        </div>
        <div className={"MainHistoryList"}>
          {history.reverse().map((value) => (
            <ClipboardItem key={value.uuid} item={value} />
          ))}
        </div>
      </div>
    );
  }
}
