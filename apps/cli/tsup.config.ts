import { defineConfig } from "tsup";

export default defineConfig({
  entry: {
    main: "./src/index.ts",
    daemon: "./src/api/up/daemon.ts",
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
  // noExternal: [/(.*)/],
  noExternal: [/@opentrader/], // Include node_modules in the bundle
  outExtension: ({ format }) => {
    if (format === "esm") return { js: ".js" };
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
});
