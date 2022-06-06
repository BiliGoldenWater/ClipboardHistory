/*
 * Copyright 2021-2022 Golden_Water
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import react from "@vitejs/plugin-react";

export default {
  root: "src/renderer/main",
  base: "./",
  plugins: [react()],
  build: {
    outDir: "../../../app/renderer/main",
  },
  resolve: {
    alias: [{ find: /^~/, replacement: "" }],
  },
};
