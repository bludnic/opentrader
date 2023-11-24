import type { IBotControl } from "#bot-processor/types/bot/bot-control.interface";
import type { IBotConfiguration } from "./bot-configuration.interface";

export type TBotContext<T extends IBotConfiguration> = {
  /**
   * Bot control panel
   */
  control: IBotControl<T>;
  /**
   * Bot configuration
   */
  config: T;
  /**
   * Event
   */
  command: "start" | "stop" | "process";
  onStart: boolean;
  onStop: boolean;
  onProcess: boolean;
};
