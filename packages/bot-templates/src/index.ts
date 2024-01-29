import type { BotTemplate } from "@opentrader/bot-processor";
import * as templates from "./templates";

export * from "./templates";

export function findTemplate(template: string): BotTemplate<any> {
  if (template in templates) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access,@typescript-eslint/no-unsafe-return -- not typed
    return (templates as any)[template];
  }

  throw new Error(
    `Template ${template} not found. Ensure that the "${template}.ts" file exists in @opentrader/bot-templates`,
  );
}

export { templates };
