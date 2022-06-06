/*
 * Copyright 2021-2022 Golden_Water
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { rollupMain } from "./rollupMain.mjs";
import { createServer } from "vite";
import { exec } from "child_process";
import viteConfig from "./viteConfig.mjs";

await rollupMain();

const server = await createServer(viteConfig);

await server.listen();

function startElectron() {
  let eleProc = exec("npx electron app");
  eleProc.stdout.on("data", function (event) {
    process.stdout.write(event);
  });
  return eleProc;
}

let electronProcess = startElectron();

electronProcess.on("exit", async () => {
  await server.close();
});
