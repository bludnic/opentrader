import type { ConfigFile } from "@rtk-query/codegen-openapi";
import { RTK_API_NAME } from "./constants";

const config: ConfigFile = {
  schemaFile: "http://localhost:4000/bapi/swagger-json",
  apiFile: "./emptyApi.ts",
  apiImport: "emptySplitApi",
  outputFile: `./${RTK_API_NAME}.ts`,
  exportName: RTK_API_NAME,
  hooks: {
    queries: true,
    lazyQueries: true,
    mutations: true,
  },
  flattenArg: true,
};

export default config;
