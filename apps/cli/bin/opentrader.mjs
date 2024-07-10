#!/usr/bin/env node

import { readFile } from "fs/promises";
import { spawn } from "child_process";
import { fileURLToPath } from "url";
import { dirname } from "path";

// Determine the script's directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Path to the file containing the admin password
const passwordFile = `${process.env.HOME}/.opentrader/pass`;

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
  const adminPassword = await readPasswordFile(passwordFile);

  // Set environment variables
  const env = {
    ...process.env,
    ADMIN_PASSWORD: adminPassword,
    DATABASE_URL: `file:${process.env.HOME}/.opentrader/dev.db`,
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
