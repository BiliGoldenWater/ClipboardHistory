/*
 * Copyright 2021-2022 Golden_Water
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { rollup } from "rollup";
import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import typescript from "@rollup/plugin-typescript";
import json from "@rollup/plugin-json";
import fs from "fs";

const files = [
  { input: "src/main/index.ts", output: "app/index.js" },
  {
    input: "src/main/preload.ts",
    output: "app/preload.js",
  },
];

// see below for details on the options
const inputOptions = {
  plugins: [resolve(), commonjs(), typescript(), json()],
  external: ["electron"],
};

const outputOptions = {
  format: "cjs",
};

export async function rollupMain() {
  if (fs.existsSync("app")) fs.rmdirSync("app", { recursive: true });

  for (const value of files) {
    const bundle = await rollup({ ...inputOptions, input: value.input });

    await bundle.write({ ...outputOptions, file: value.output });
  }

  fs.copyFileSync("icon.png", "app/icon.png");
}
