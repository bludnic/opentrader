import packageJson from "../../package.json";

export async function version() {
  return {
    result: `OpenTrader version: ${packageJson.version}`,
  };
}
