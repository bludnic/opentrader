import { CommandResult } from "../types.js";
import { savePassword } from "../utils/password.js";

export async function setPassword(newPassword: string): Promise<CommandResult> {
  savePassword(newPassword);

  return {
    result: `Password saved successfully. Please restart the daemon.`,
  };
}
