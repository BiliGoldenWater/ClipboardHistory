/*
 * Copyright 2021-2022 Golden_Water
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { rollup } from "rollup";
import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import typescript from "@rollup/plugin-typescript";
import fs from "fs";

// see below for details on the options
const inputOptions = {
  input: "src/main/index.ts",
  plugins: [resolve(), commonjs(), typescript()],
  external: ["electron"],
};

const outputOptions = {
  file: "app/index.js",
  format: "cjs",
};

export async function rollupMain() {
  if (fs.existsSync("app")) fs.rmdirSync("app", { recursive: true });

  const bundle = await rollup(inputOptions);

  await bundle.write(outputOptions);
}
