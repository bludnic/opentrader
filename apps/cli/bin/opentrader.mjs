#!/usr/bin/env node

import { readFile } from "node:fs/promises";
import { spawn } from "node:child_process";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { homedir } from "node:os";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const APP_DIR = ".opentrader";
export const appPath = join(homedir(), APP_DIR);

// Path to the file containing the admin password
const passwordFilePath = join(appPath, "pass");
const dbFilePath = join(appPath, "dev.db");

// Function to read the password file
async function readPasswordFile(filePath) {
  try {
    const data = await readFile(filePath, "utf-8");
    return data.trim();
  } catch (error) {
    console.error("Password file not found!");
    process.exit(1);
  }
}

// Main function to run the script
async function main() {
  const adminPassword = await readPasswordFile(passwordFilePath);

  // Set environment variables
  const env = {
    ...process.env,
    ADMIN_PASSWORD: adminPassword,
    DATABASE_URL: `file:${dbFilePath}`,
  };

  // Run the Node.js script
  const args = [`${__dirname}/../dist/main.mjs`, ...process.argv.slice(2)];
  const child = spawn("node", args, { env, stdio: "inherit" });

  child.on("close", (code) => {
    if (code !== 0) {
      console.error(`Process exited with code ${code}`);
    }
  });
}

main();
