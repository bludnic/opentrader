import type { IExchange } from "@opentrader/exchanges";
import { BotControl } from "./bot-control";
import { effectRunnerMap } from "./effect-runner";
import { isEffect } from "./effects";
import type {
  BotTemplate,
  IBotConfiguration,
  IBotControl,
  IStore,
  TBotContext,
} from "./types";
import { createContext } from "./utils/createContext";

export class StrategyRunner<T extends IBotConfiguration> {
  constructor(
    private control: IBotControl,
    private botConfig: T,
    private exchange: IExchange,
    private botTemplate: BotTemplate<T>,
  ) {}

  async start() {
    const context = createContext(
      this.control,
      this.botConfig,
      this.exchange,
      "start",
    );

    await this.runTemplate(context);
  }

  async stop() {
    const context = createContext(
      this.control,
      this.botConfig,
      this.exchange,
      "stop",
    );

    await this.runTemplate(context);
  }

  async process() {
    const context = createContext(
      this.control,
      this.botConfig,
      this.exchange,
      "process",
    );

    await this.runTemplate(context);
  }

  private async runTemplate(context: TBotContext<T>): Promise<void> {
    const generator = this.botTemplate(context);

    let item = generator.next();

    for (; !item.done; ) {
      if (item.value instanceof Promise) {
        const result = await item.value;

        item = generator.next(result);
      } else if (isEffect(item.value)) {
        const effect = item.value;
        const effectRunner = effectRunnerMap[effect.type];

        item = generator.next(await effectRunner(effect, context));
      } else {
        console.log(item.value);
        throw new Error("Unsupported effect");
      }
    }
  }
}

export function createStrategyRunner<T extends IBotConfiguration>(options: {
  store: IStore;
  exchange: IExchange;
  botConfig: T;
  botTemplate: BotTemplate<T>;
}) {
  const { botConfig, store, exchange, botTemplate } = options;

  const botControl = new BotControl(store, botConfig);
  const manager = new StrategyRunner(
    botControl,
    botConfig,
    exchange,
    botTemplate,
  );

  return manager;
}
