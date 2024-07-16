#!/usr/bin/env node

import { $ } from "execa";
import { generatePackageJson } from "./utils/generate-package-json.mjs";

// Clean up the release directory
await $`rm -rf release`;
await $`mkdir release`;

// Copy the dist directory from the CLI app
await $`cp -r apps/cli/dist release/`;
console.log("Copied ./dist");

// Copy binaries and scripts
await $`cp -r apps/cli/bin release/`;
await $`cp -r apps/cli/scripts release/`;
console.log("Copied ./bin and ./scripts");

// Copy Prisma schema and migrations
await $`cp packages/prisma/src/schema.prisma release/schema.prisma`;
console.log("Copied ./schema.prisma");
await $`cp -r packages/prisma/src/migrations release/`;
console.log("Copied ./migrations");
await $`cp apps/cli/seed.ts release/seed.ts`;
console.log("Copied ./seed.ts");

// Copy frontend app
await $`cp -r pro/frontend/dist release/frontend`;
console.log("Copied ./frontend");

// Generate package.json with all dependencies
generatePackageJson("./release");

// Generate shrinkwrap file
console.log("Running `npm install --package-lock-only --ignore-scripts`");
const { stdout: projectDir } = await $`pwd`;
const npmInstallProcess = $(
  "npm install --package-lock-only --ignore-scripts",
  {
    shell: true,
    cwd: `${projectDir}/release`,
  },
);
npmInstallProcess.stdout.pipe(process.stdout);
npmInstallProcess.stderr.pipe(process.stderr);
await npmInstallProcess;

await $(`npm shrinkwrap`, {
  shell: true,
  cwd: `${projectDir}/release`,
});
console.log("Generated shrinkwrap.json");

console.log(
  "Release is ready. Run `cd release && npm publish` to publish to NPM.",
);
