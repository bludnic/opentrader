import * as fs from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "url";
import JSON5 from "json5";
import { logger } from "@opentrader/logger";
import { BotConfig, ExchangeConfig } from "./types.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const rootDir = join(__dirname, "..");
const currDir = process.cwd();

const getConfigFilePath = (path: string, config: string) =>
  fs.existsSync(`${path}/${config}`) ? `${path}/${config}` : false;

/**
 * Read a bot configuration file
 * @param configName - Custom config file name
 * @returns Parsed JSON5 config file
 */
export function readBotConfig<T = any>(
  configName = "config.json5",
): BotConfig<T> {
  const currDirConfigPath = getConfigFilePath(currDir, configName);
  const rootDirConfigPath = getConfigFilePath(rootDir, configName);

  const configPath = currDirConfigPath || rootDirConfigPath;

  if (!configPath) {
    throw new Error(`Missing ${configName} file in current or root directory`);
  }

  logger.info(`Using bot config file: ${configPath}`);
  const config = JSON5.parse<BotConfig<T>>(fs.readFileSync(configPath, "utf8"));

  return config;
}

/**
 * Read exchange accounts configuration file
 * @param configName - Custom config file name
 * @returns Parsed JSON5 config file
 */
export function readExchangesConfig(
  configName = "exchanges.json5",
): Record<string, ExchangeConfig> {
  const currDirConfigPath = getConfigFilePath(currDir, configName);
  const rootDirConfigPath = getConfigFilePath(rootDir, configName);
  const configPath = currDirConfigPath || rootDirConfigPath;

  if (!configPath) {
    throw new Error(`Missing ${configName} file in current or root directory`);
  }

  logger.info(`Using exchanges config file: ${configPath}`);
  const config = JSON5.parse<Record<string, ExchangeConfig>>(
    fs.readFileSync(configPath, "utf8"),
  );

  return config;
}
