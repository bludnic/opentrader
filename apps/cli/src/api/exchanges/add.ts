import { ExchangeCode } from "@opentrader/types";
import type { CommandResult } from "../../types.js";
import { createDaemonRpcClient } from "../../daemon-rpc.js";

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
  /**
   * Is paper account?
   */
  paper: boolean;
};

const daemonRpc = createDaemonRpcClient();

export async function addExchangeAccount(options: Options): Promise<CommandResult> {
  await daemonRpc.exchangeAccount.create.mutate({
    name: options.name || options.label,
    label: options.label,
    exchangeCode: options.code,
    apiKey: options.key,
    secretKey: options.secret,
    password: options.password,
    isDemoAccount: options.demo,
    isPaperAccount: options.paper,
  });

  return {
    result: "Exchange account added successfully.",
  };
}
