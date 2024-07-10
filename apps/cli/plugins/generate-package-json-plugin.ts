import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { Plugin } from "esbuild";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const CLI_DIR = path.resolve(__dirname, "../");
const PACKAGES_DIR = path.resolve(CLI_DIR, "../../packages");

/**
 * ESBuild plugin for generating a `package.json` that includes all the
 * dependencies used by Internal Packages. The generated `package.json` is used
 * for later publishing on NPM.
 */
export const generatePackageJsonPlugin = (): Plugin => ({
  name: "generate-package-json",
  setup(build) {
    if (build.initialOptions.outdir !== "release/dist") {
      console.log('Skipping "package.json" generation for non-release build');
      return;
    }

    build.onEnd(() => {
      const rootPackageJson = JSON.parse(
        fs.readFileSync("./package.json", "utf-8"),
      );
      const dependencies = {};

      // Function to merge dependencies, excluding specified packages
      const mergeDependencies = (
        source: Record<string, string>,
        target: Record<string, string>,
      ) => {
        for (const [key, value] of Object.entries(source)) {
          if (!key.startsWith("@opentrader/")) {
            if (!target[key]) {
              target[key] = value;
            } else if (target[key] !== value) {
              console.warn(
                `Version conflict for ${key}: ${target[key]} vs ${value}`,
              );
            }
          }
        }
      };

      // Function to find package.json files in immediate subdirectories
      const findPackageJsonFiles = (dir: string) => {
        const results: string[] = [];
        const list = fs.readdirSync(dir);
        list.forEach((file) => {
          const filePath = path.resolve(dir, file);
          const stat = fs.statSync(filePath);
          if (stat && stat.isDirectory()) {
            const packageJsonPath = path.resolve(filePath, "package.json");
            if (fs.existsSync(packageJsonPath)) {
              results.push(packageJsonPath);
            }
          }
        });

        return results;
      };

      // Get all package.json files in the immediate subdirectories
      const packageJsonFiles = findPackageJsonFiles(PACKAGES_DIR);

      packageJsonFiles.forEach((file) => {
        const packageJson = JSON.parse(fs.readFileSync(file, "utf-8"));

        if (packageJson.dependencies) {
          mergeDependencies(packageJson.dependencies, dependencies);
        }
      });

      // Merge root dependencies with collected dependencies
      if (rootPackageJson.dependencies) {
        mergeDependencies(rootPackageJson.dependencies, dependencies);
      }

      // Create new package.json for publishing without devDependencies
      const { devDependencies, ...rootPackageJsonWithoutDev } = rootPackageJson;
      const newPackageJson = {
        ...rootPackageJsonWithoutDev,
        dependencies,
      };

      // Add postinstall script
      newPackageJson.scripts.postinstall =
        'prisma generate && DATABASE_URL="file:${HOME}/.opentrader/dev.db" prisma migrate dev && node scripts/postinstall.mjs';

      // Write to new package.json file
      newPackageJson.prisma = {
        schema: "schema.prisma",
        seed: "tsx seed.ts",
      };

      const distPath = path.resolve(CLI_DIR, build.initialOptions.outdir!);

      // Write to new package.json file
      if (!fs.existsSync(distPath)) {
        fs.mkdirSync(distPath, { recursive: true });
      }

      fs.writeFileSync(
        path.resolve(distPath, "../package.json"),
        JSON.stringify(newPackageJson, null, 2),
      );

      console.log(
        `Generated package.json. Check the release build at ${build.initialOptions.outdir}`,
      );
    });
  },
});
