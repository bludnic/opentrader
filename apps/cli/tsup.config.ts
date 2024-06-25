import { defineConfig } from "tsup";

export default defineConfig({
  entry: {
    main: "./src/index.ts",
  }, // Adjust this to your entry file
  format: ["esm", "cjs"],
  outDir: "dist",
  dts: false, // Generate TypeScript declaration files if needed
  splitting: false,
  sourcemap: false,
  clean: true,
  minify: false,
  skipNodeModulesBundle: false,
  bundle: true,
  target: "esnext",
  treeshake: true,
  external: [],
  noExternal: [/node_modules/, /@opentrader/], // Include node_modules in the bundle
  outExtension: ({ format }) => {
    if (format === "esm") return { js: ".mjs" };
    if (format === "cjs") return { js: ".cjs" };
    return { js: ".js" };
  },
  esbuildOptions: (options) => {
    options.banner = {
      js: "import { createRequire } from 'module';const require = createRequire(import.meta.url);",
    };
  },
});
