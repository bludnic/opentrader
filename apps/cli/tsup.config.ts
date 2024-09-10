import { defineConfig } from "tsup";

import { copyPrismaSchemaPlugin } from "./plugins/copy-prisma-schema-plugin.js";
import { generatePackageJsonPlugin } from "./plugins/generate-package-json-plugin.js";

export default defineConfig({
  entry: {
    main: "./src/index.ts",
    daemon: "./src/api/up/daemon.ts",
    effects: "./src/effects.ts",
  }, // Adjust this to your entry file
  format: ["esm"],
  outDir: "dist",
  dts: false, // Generate TypeScript declaration files if needed
  splitting: true,
  sourcemap: false,
  clean: true,
  minify: false,
  skipNodeModulesBundle: false,
  bundle: true,
  target: "esnext",
  treeshake: true,
  external: [],
  env: {
    NODE_ENV: "production",
  },
  noExternal: [/@opentrader/], // Include internal packages into the bundle
  outExtension: ({ format }) => {
    if (format === "esm") return { js: ".mjs" };
    if (format === "cjs") return { js: ".cjs" };
    return { js: ".js" };
  },
  esbuildOptions: (options) => {
    options.banner = {
      js: `
        import { createRequire } from 'module';

        const require = createRequire(import.meta.url);

        if (typeof globalThis.__dirname === "undefined") {
          globalThis.__dirname = new URL('.', import.meta.url).pathname;
        }
        if (typeof globalThis.__filename === "undefined") {
          globalThis.__filename = new URL(import.meta.url).pathname;
        }
      `,
    };
  },
  esbuildPlugins: [generatePackageJsonPlugin(), copyPrismaSchemaPlugin()],
});
