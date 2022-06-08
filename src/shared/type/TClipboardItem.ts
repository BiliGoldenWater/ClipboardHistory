/*
 * Copyright 2021-2022 Golden_Water
 * SPDX-License-Identifier: AGPL-3.0-only
 */

export type TClipboardItem = {
  uuid: string;
  type: "text/plain" | "text/html" | "image/png";
  value: string;
  plainText?: string;
  isEmpty: boolean;
};
