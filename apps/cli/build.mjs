import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const rootPackageJson = JSON.parse(fs.readFileSync("./package.json", "utf-8"));
const dependencies = {};

// Function to merge dependencies, excluding specified packages
const mergeDependencies = (source, target) => {
  for (const [key, value] of Object.entries(source)) {
    if (
      !key.startsWith("@opentrader/") &&
      key !== "eslint" &&
      key !== "prettier"
    ) {
      if (!target[key]) {
        target[key] = value;
      } else if (target[key] !== value) {
        console.warn(`Version conflict for ${key}: ${target[key]} vs ${value}`);
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

// Define the base path for the search
const basePath = path.resolve(__dirname, "../../packages");

// Get all package.json files in the immediate subdirectories
const packageJsonFiles = findPackageJsonFiles(basePath);

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

// Write to new package.json file
const distPath = path.resolve(__dirname, "dist");
if (!fs.existsSync(distPath)) {
  fs.mkdirSync(distPath);
}

fs.writeFileSync(
  path.resolve(distPath, "package.json"),
  JSON.stringify(newPackageJson, null, 2),
);

console.log("Generated package.json at dist/package.json");
