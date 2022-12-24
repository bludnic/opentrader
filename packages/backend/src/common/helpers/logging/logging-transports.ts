import * as winston from 'winston';
import { utilities as nestWinstonUtilities } from 'nest-winston';

export const winstonJsonConsoleTransport = new winston.transports.Console({
  format: winston.format.combine(winston.format.json()),
  level: 'silly',
});

export const winstonNestConsoleTransport = new winston.transports.Console({
  format: winston.format.combine(nestWinstonUtilities.format.nestLike()),
  level: 'silly',
});

export const winstonNestLikeTransport = new winston.transports.Console({
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.ms(),
    nestWinstonUtilities.format.nestLike('Bifrost Backend', {
      prettyPrint: true,
    }),
  ),
  level: 'silly',
});
