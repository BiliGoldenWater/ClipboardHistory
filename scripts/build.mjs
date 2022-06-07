/*
 * Copyright 2021-2022 Golden_Water
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { rollupMain } from "./rollupMain.mjs";
import { build } from "vite";
import viteConfig from "./viteConfig.mjs";
import * as fs from "fs";
import builder, { Arch, Platform } from "electron-builder";

if (fs.existsSync("dist")) fs.rmdirSync("dist", { recursive: true });

await rollupMain();

await build(viteConfig);

// let pkg = JSON.parse(fs.readFileSync("package.json").toString());
// pkg.build = undefined;
// fs.writeFileSync("./app/package.json", JSON.stringify(pkg));

let config = {
  appId: "indi.goldenwater.clipboardhistory",
  productName: "Clipboard History",
  files: ["app/**/*"],
  electronDownload: {
    mirror: "https://npm.taobao.org/mirrors/electron/",
  },

  mac: { target: "zip", icon: "icon.icns" },
  win: { target: "zip" },
  linux: { target: "zip" },
};

await builder.build({
  config: config,
  targets: Platform.MAC.createTarget(null, Arch.universal),
});
// await builder.build({
//   config: config,
//   targets: Platform.WINDOWS.createTarget(null, Arch.x64),
// });
// await builder.build({
//   config: config,
//   targets: Platform.WINDOWS.createTarget(null, Arch.arm64),
// });
// await builder.build({
//   config: config,
//   targets: Platform.LINUX.createTarget(null, Arch.x64),
// });
// await builder.build({
//   config: config,
//   targets: Platform.LINUX.createTarget(null, Arch.arm64),
// });
