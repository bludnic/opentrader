import pino from "pino";
import pinoPretty from "pino-pretty";

export const logger = pino(pinoPretty());
