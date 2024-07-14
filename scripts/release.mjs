#!/usr/bin/env node

import { $ } from "execa";
import { generatePackageJson } from "./generate-package-json.mjs";

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

// Generate package.json with all dependencies
generatePackageJson("./release");
console.log(
  "Release is ready. Run `cd release && npm publish` to publish to NPM.",
);
