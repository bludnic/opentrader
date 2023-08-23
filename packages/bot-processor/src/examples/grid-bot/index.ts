import { ExchangeCode } from "@bifrost/types";
import { exchanges } from "@bifrost/exchanges";
import { BotManager } from "../../bot-manager";
import { IBotConfiguration } from "../../types/bot/bot-configuration.interface";

import { BotControl } from "./../../bot-control";
import { StateManagement } from "./state/state-management";
import { useGridBot } from "./use-grid-bot-template";

const exchange = exchanges[ExchangeCode.OKX]();

const bot: IBotConfiguration = {
  id: "BOT1",
  baseCurrency: "ETH", // e.g 1INCH
  quoteCurrency: "USDT", // e.g USDT
};

export async function run() {
  const state = new StateManagement();

  const botControl = new BotControl(state, bot);

  const manager = new BotManager(botControl, exchange);

  await manager.process(useGridBot);
}
