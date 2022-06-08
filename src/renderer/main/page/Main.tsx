/*
 * Copyright 2021-2022 Golden_Water
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import React, { ReactNode, startTransition } from "react";
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
      history: [],
    };
  }

  componentDidMount() {
    this.updateHistory();
  }

  updateHistory() {
    startTransition(() => {
      let oldHistory = this.state.history;
      const hadItemUUIDs = oldHistory.map((value) => value.uuid);
      const newHistory = window.electron.getHistory(hadItemUUIDs);

      oldHistory = oldHistory.filter(
        (value) => newHistory.findIndex((it) => it.uuid === value.uuid) !== -1
      );

      for (let item of newHistory) {
        if (hadItemUUIDs.indexOf(item.uuid) !== -1) continue;

        oldHistory.push(item);
      }

      this.setState({ history: oldHistory }, () => {
        this.loopId = window.setTimeout(this.updateHistory.bind(this), 200);
      });
    });
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
          {history
            .filter((value) => !value.isEmpty)
            .map((value, index) => (
              <ClipboardItem
                key={value.uuid}
                item={value}
                deletable={index < history.length - 1}
              />
            ))
            .reverse()}
        </div>
      </div>
    );
  }
}
