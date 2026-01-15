#!/usr/bin/env node

import { readdirSync, writeFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const flagsFolder = "./public/static/images/flags";
const __filename = fileURLToPath(import.meta.url);

function main() {
  const data = readdirSync(flagsFolder).map((file) => file.split(".")[0]);

  writeFileSync(
    join(dirname(__filename), "..", "available-flags.json"),
    JSON.stringify(data)
  );
}

main();
