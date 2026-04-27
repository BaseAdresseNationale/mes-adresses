#!/usr/bin/env node

import { readdirSync, writeFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const flagsFolder = "./public/static/images/flags";
const __filename = fileURLToPath(import.meta.url);

function main() {
  const data = readdirSync(flagsFolder).map((file) => {
    return {
      lang: file.split(".")[0],
      file,
    };
  });

  writeFileSync(
    join(dirname(__filename), "..", "available-flags.json"),
    JSON.stringify(data)
  );
}

main();
