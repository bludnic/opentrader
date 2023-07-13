#!/usr/bin/env node

const exec = require("child_process").exec;

const swaggerDir = './src/shared/3commas-api/swagger';

const args = {
  specFile: `${swaggerDir}/schema.json`,
  generatorName: "typescript-axios",
  output: `${swaggerDir}/client`,
  config: `${swaggerDir}/config.json`,
  template: `${swaggerDir}/templates/typescript-axios`,
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
