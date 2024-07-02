import * as fs from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "url";
import JSON5 from "json5";
import { logger } from "@opentrader/logger";
import { BotConfig, ConfigName, ExchangeConfig } from "./types.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const rootDir = join(__dirname, "..");
const currDir = process.cwd();

const PROD_CONFIG =
  fs.existsSync(`${currDir}/config.prod.json5`) ||
  fs.existsSync(`${rootDir}/config.prod.json5`)
    ? "prod"
    : undefined;
const DEV_CONFIG =
  fs.existsSync(`${currDir}/config.dev.json5`) ||
  fs.existsSync(`${rootDir}/config.dev.json5`)
    ? "dev"
    : undefined;

export const DEFAULT_CONFIG_NAME: ConfigName =
  PROD_CONFIG || DEV_CONFIG || "default";

/**
 * Read a bot configuration file
 * @param configName - Config name. Example: dev, prod, default. Will be converted to `config.<configName>.json5`
 * @returns Parsed JSON5 config file
 */
export function readBotConfig<T = any>(
  configName: ConfigName = DEFAULT_CONFIG_NAME,
): BotConfig<T> {
  const configFileName = `config.${configName}.json5`;
  const configPath = fs.existsSync(`${currDir}/${configFileName}`)
    ? `${currDir}/${configFileName}`
    : `${rootDir}/${configFileName}`;

  logger.info(`Using bot config file: ${configPath}`);
  const config = JSON5.parse<BotConfig<T>>(fs.readFileSync(configPath, "utf8"));

  return config;
}

export function readExchangesConfig(
  configName: ConfigName = "default",
): Record<string, ExchangeConfig> {
  const configFileName = `exchanges.${configName}.json5`;
  const configPath = fs.existsSync(`${currDir}/${configFileName}`)
    ? `${currDir}/${configFileName}`
    : `${rootDir}/${configFileName}`;

  logger.info(`Using exchanges config file: ${configPath}`);
  const config = JSON5.parse<Record<string, ExchangeConfig>>(
    fs.readFileSync(configPath, "utf8"),
  );

  return config;
}
