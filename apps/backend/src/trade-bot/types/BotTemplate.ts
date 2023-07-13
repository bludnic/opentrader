import { IBotContext } from "./BotContext";

export interface IBotTemplate {
    onStart: (ctx: IBotContext) => void | Promise<void>;
    /**
     * Called when one or more orders was filled.
     * @returns 
     */
    onChange: (ctx: IBotContext) => void | Promise<void>;
    onStop: (ctx: IBotContext) => void | Promise<void>;
}