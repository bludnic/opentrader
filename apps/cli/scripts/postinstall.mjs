import { homedir } from "node:os";
import { execSync } from "node:child_process";
import { writeFileSync, existsSync, mkdirSync } from "node:fs";
import { join } from "node:path";
import { generate } from "random-words";

const APP_DIR = ".opentrader";
export const appPath = join(homedir(), APP_DIR);
export const passFilePath = join(appPath, "pass");
export const dbFilePath = join(appPath, "dev.db");
export const customStrategiesPath = join(appPath, "strategies");

function runMigrations() {
  const commands = [
    "prisma generate --generator client", // generate prisma client
    `prisma migrate deploy`, // run migrations
    `node seed.mjs`, // seed the database
  ];

  for (const command of commands) {
    const env = { ...process.env, DATABASE_URL: `file:${dbFilePath}` };

    execSync(command, { env, stdio: "inherit" });
  }
}

function generatePassword(wordCount = 3, numberCount = 2) {
  // Generate random words
  const words = generate({
    exactly: 1,
    wordsPerString: wordCount,
    separator: "-",
  });

  // Generate random numbers
  const numbers = Array.from({ length: numberCount }, () => Math.floor(Math.random() * 10)).join("");

  // Combine words and numbers
  return words[0] + numbers;
}

function savePassword() {
  const password = generatePassword();

  if (existsSync(passFilePath)) {
    console.log(`🔐 Password already set in ${passFilePath}. Skipping...`);
    return;
  }

  writeFileSync(passFilePath, password, {
    encoding: "utf8",
    recursive: true,
  });
  console.log(`Generated new ADMIN PASSWORD in ${passFilePath}`);
  console.log(`Please keep this password safe. You will need it to access the admin panel.`);
  console.log(`🔒 Password: ${password}`);
}

function createCustomStrategiesDir() {
  if (!existsSync(customStrategiesPath)) {
    mkdirSync(customStrategiesPath, { recursive: true });
  }
}

runMigrations();
savePassword();
createCustomStrategiesDir();
