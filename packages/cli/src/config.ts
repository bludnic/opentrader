import * as fs from "node:fs";
import { join } from "node:path";
import JSON5 from "json5";
import { logger } from "@opentrader/logger";
import { IBotConfiguration } from "@opentrader/bot-processor";
import { ConfigName } from "./types";

const rootDir = join(__dirname, "..");

/**
 * Read a bot configuration file
 * @param configName - Config name. Example: dev, prod, default. Will be converted to `config.<configName>.json5`
 * @returns Parsed JSON5 config file
 */
export function readBotConfig<T extends any = any>(
  configName: ConfigName = "default",
): IBotConfiguration<T> {
  const configFileName = `config.${configName}.json5`;
  const configPath = rootDir + `/${configFileName}`;

  logger.info(`Using config file: ${configFileName}`);
  const config = JSON5.parse(fs.readFileSync(configPath, "utf8"));

  return config;
}
