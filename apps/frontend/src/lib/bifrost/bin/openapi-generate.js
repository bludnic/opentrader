#!/usr/bin/env node

const exec = require("child_process").exec;

const args = {
  specFile: "./src/lib/bifrost/schema.json",
  generatorName: "typescript-axios",
  output: "./src/lib/bifrost/client",
  config: "./src/lib/bifrost/config.json",
  template: "typescript-axios",
};

exec(
  [
    "npx",
    "@openapitools/openapi-generator-cli",
    "generate",
    `--type-mappings Date=string`,
    `--skip-validate-spec`,
    `-i ${args.specFile}`,
    `-g ${args.generatorName}`,
    `-o ${args.output}`,
    `-c ${args.config}`,
    `-t ${args.template}`,
  ].join(" "),
  (error, stdout, stderr) => {
    if (error) {
      console.log(error);
      return;
    }

    console.log(`STDOUT: ${stdout}`);
  }
);
