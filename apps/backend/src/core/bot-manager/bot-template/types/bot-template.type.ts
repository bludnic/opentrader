import { IBotControl } from "../../types/bot-control.interface"

export type BotTemplate = (bot: IBotControl) => Generator<unknown, unknown>
