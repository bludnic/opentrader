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
      const prismaSchemaPath = path.resolve(PRISMA_DIR, "src/schema.prisma");
      const prismaSchemaDest = path.resolve(DIST_DIR, "../schema.prisma");

      if (!fs.existsSync(DIST_DIR)) {
        fs.mkdirSync(DIST_DIR, {
          recursive: true,
        });
      }

      fs.copyFileSync(prismaSchemaPath, prismaSchemaDest);
    });
  },
});
