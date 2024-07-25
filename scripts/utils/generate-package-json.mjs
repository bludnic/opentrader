import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ROOT_DIR = path.resolve(__dirname, "../../");
const CLI_DIR = path.resolve(ROOT_DIR, "./apps/cli");
const PACKAGES_DIR = path.resolve(ROOT_DIR, "./packages");

console.log("ROOT_DIR", ROOT_DIR);
console.log("CLI_DIR", CLI_DIR);
console.log("PACKAGES_DIR", PACKAGES_DIR);

export function generatePackageJson(outDir) {
  const mainPackageJson = JSON.parse(
    fs.readFileSync(path.join(CLI_DIR, "package.json"), "utf-8"),
  );
  const dependencies = {};

  // Function to merge dependencies, excluding specified packages
  const mergeDependencies = (source, target) => {
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
  const findPackageJsonFiles = (dir) => {
    const results = [];
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
  if (mainPackageJson.dependencies) {
    mergeDependencies(mainPackageJson.dependencies, dependencies);
  }

  // Create new package.json for publishing without devDependencies
  const { devDependencies, ...rootPackageJsonWithoutDev } = mainPackageJson;
  const newPackageJson = {
    ...rootPackageJsonWithoutDev,
    dependencies,
  };

  // Add postinstall script
  newPackageJson.scripts.postinstall =
    "prisma generate --generator client && " + // Generate only @prisma/client (it will skip Zod generator)
    'DATABASE_URL="file:${HOME}/.opentrader/dev.db" prisma migrate deploy && ' +
    'DATABASE_URL="file:${HOME}/.opentrader/dev.db" tsx seed.ts && ' +
    "node scripts/postinstall.mjs";

  // Write to new package.json file
  newPackageJson.prisma = {
    schema: "schema.prisma",
    seed: "tsx seed.ts",
  };

  const releaseDir = path.resolve(ROOT_DIR, outDir);

  // Write to new package.json file
  if (!fs.existsSync(releaseDir)) {
    fs.mkdirSync(releaseDir, { recursive: true });
  }

  fs.writeFileSync(
    path.resolve(releaseDir, "./package.json"),
    JSON.stringify(newPackageJson, null, 2),
  );

  console.log(`Generated ${outDir}/package.json`);
}
