import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { Plugin } from "esbuild";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const CLI_DIR = path.resolve(__dirname, "../");
const PRISMA_DIR = path.resolve(CLI_DIR, "../../packages/prisma");
const DIST_DIR = path.resolve(CLI_DIR, "release/dist");

/**
 * Copy the Prisma schema file to the release build directory.
 */
export const copyPrismaSchemaPlugin = (): Plugin => ({
  name: "copy-prisma-schema",
  setup(build) {
    if (build.initialOptions.outdir !== "release/dist") {
      console.log('Skipping "schema.prisma" copy for non-release build');
      return;
    }

    build.onEnd(() => {
      // Copy schema.prisma
      const prismaSchemaPath = path.resolve(PRISMA_DIR, "src/schema.prisma");
      const prismaSchemaDest = path.resolve(DIST_DIR, "../schema.prisma");

      if (!fs.existsSync(DIST_DIR)) {
        fs.mkdirSync(DIST_DIR, {
          recursive: true,
        });
      }

      fs.copyFileSync(prismaSchemaPath, prismaSchemaDest);

      // Copy seed.ts
      const prismaSeedPath = path.resolve(CLI_DIR, "seed.ts");
      const prismaSeedDest = path.resolve(DIST_DIR, "../seed.ts");
      fs.copyFileSync(prismaSeedPath, prismaSeedDest);

      // Copy migrations
      const prismaMigrationsPath = path.resolve(PRISMA_DIR, "src/migrations");
      const prismaMigrationsDest = path.resolve(DIST_DIR, "../migrations");

      if (!fs.existsSync(prismaMigrationsDest)) {
        fs.mkdirSync(prismaMigrationsDest, {
          recursive: true,
        });
      }

      copyDirectory(prismaMigrationsPath, prismaMigrationsDest);
    });
  },
});

function copyDirectory(src: string, dest: string) {
  // Create destination folder if it doesn't exist
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }

  // Read all items in the source directory
  const items = fs.readdirSync(src);

  // Iterate through each item and copy it to the destination
  items.forEach((item) => {
    const srcPath = path.join(src, item);
    const destPath = path.join(dest, item);

    if (fs.lstatSync(srcPath).isDirectory()) {
      // If item is a directory, recursively copy it
      copyDirectory(srcPath, destPath);
    } else {
      // If item is a file, copy it
      fs.copyFileSync(srcPath, destPath);
    }
  });
}
