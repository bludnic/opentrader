import type { Context } from "../../../utils/context.js";

type Options = {
  ctx: Context;
};

export async function healhcheck(opts: Options) {
  return {
    status: "ok",
    time: new Date().getTime(),
  };
}
