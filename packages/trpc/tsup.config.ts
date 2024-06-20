import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/**/*.ts"],
  sourcemap: false,
  clean: true,
  format: ["cjs"],
});
