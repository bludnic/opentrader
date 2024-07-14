import { ExchangeCode } from "@opentrader/types";
import { logger } from "@opentrader/logger";
import type { CommandResult } from "../../types.js";
import { createClient } from "../../daemon.js";

type Options = {
  config: string;
  /**
   * Exchange name.
   */
  name: string | null;
  /**
   * Exchange label.
   */
  label: string;
  code: ExchangeCode;
  key: string;
  secret: string;
  password: string | null;
  /**
   * Is demo account?
   */
  demo: boolean;
};

const daemon = createClient();

export async function updateExchangeAccount(
  options: Options,
): Promise<CommandResult> {
  const exchangeAccounts = await daemon.exchangeAccount.list.query();
  const exchangeAccount = exchangeAccounts.find(
    (account) => account.label === options.label,
  );

  if (!exchangeAccount) {
    logger.error(
      `Exchange account with label "${options.label}" not found in DB. Create it first.`,
    );
    return {
      result: undefined,
    };
  }

  await daemon.exchangeAccount.update.mutate({
    id: exchangeAccount.id,
    body: {
      name: options.name || exchangeAccount.name,
      exchangeCode: options.code,
      apiKey: options.key,
      secretKey: options.secret,
      password: options.password,
      isDemoAccount: options.demo,
    },
  });

  return {
    result: `Exchange account with label "${exchangeAccount.label}" updated successfully.`,
  };
}
