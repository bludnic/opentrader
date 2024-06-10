import { prettyFactory } from "pino-pretty";

const pretty = prettyFactory({});

export const prettyLog = (message: string) => {
  const parsedMessage = JSON.parse(message);
  const prettifiedMessage = pretty(parsedMessage);
  console.log(prettifiedMessage.replace(/\n/g, ""));
};
