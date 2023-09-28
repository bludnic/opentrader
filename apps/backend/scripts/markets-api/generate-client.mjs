import * as dotenv from 'dotenv';
import { resolve } from 'path';
import { $ } from 'execa';

const envFileName =
  process.env.NODE_ENV !== 'production' ? '.env.development.local' : undefined;
const envFilePath = resolve('../../', envFileName);

dotenv.config({
  path: envFilePath,
});

const schemaPath = './src/lib/markets-api';
// const specFile = `${process.env.MARKETS_SERVICE_API_URL}/mapi/swagger-json`;
const specFile = resolve(schemaPath, 'schema.json');
const args = {
  specFile,
  generatorName: 'typescript-axios',
  // @source https://github.com/OpenAPITools/openapi-generator/tree/master/modules/openapi-generator/src/main/resources/typescript-axios
  template: 'typescript-axios',
  config: resolve(schemaPath, 'config.json'),
  output: resolve(schemaPath, './client'),
};

run();

async function run() {
  const $$ = $({ shell: true, stdout: 'inherit' });

  const cliArgs = [
    `--type-mappings Date=string`,
    `--skip-validate-spec`,
    `-i ${args.specFile}`,
    `-g ${args.generatorName}`,
    `-t ${args.template}`,
    `-c ${args.config}`,
    `-o ${args.output}`,
  ];

  await $$`openapi-generator-cli generate ${cliArgs}`;
}
