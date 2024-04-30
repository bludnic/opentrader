export type ConfigName = "default" | "dev" | "prod";

export type CommandResult<T extends unknown = unknown> = {
  result: T;
};
