import { z, ZodObject } from "zod";
import { zodToJsonSchema, type JsonSchema7Type } from "zod-to-json-schema";
import { BotTemplate } from "@opentrader/bot-processor";
import { templates } from "@opentrader/bot-templates";
import { customStrategies } from "@opentrader/bot-templates/server";
import type { Context } from "../../../../utils/context.js";

type Options = {
  ctx: {
    user: NonNullable<Context["user"]>;
  };
};

type StrategyName = keyof typeof templates | string;
type StrategyInfo = { schema: JsonSchema7Type; isCustom: boolean } & Pick<
  BotTemplate<any>,
  "displayName" | "hidden" | "runPolicy" | "watchers" | "requiredHistory"
>;

export async function getStrategies({ ctx }: Options) {
  const strategies: Record<StrategyName, BotTemplate<any>> = {
    ...customStrategies,
    ...templates,
  };

  const result: Record<StrategyName, StrategyInfo> = {};
  for (const [strategyName, strategy] of Object.entries(strategies)) {
    const zodSchema = strategy.schema instanceof ZodObject ? strategy.schema : z.object({});

    result[strategyName] = {
      schema: zodToJsonSchema(zodSchema),
      isCustom: strategyName in customStrategies,
      displayName: strategy.displayName,
      hidden: !!strategy.hidden,
      runPolicy: strategy.runPolicy,
      watchers: strategy.watchers,
      requiredHistory: strategy.requiredHistory,
    };
  }

  return result;
}
