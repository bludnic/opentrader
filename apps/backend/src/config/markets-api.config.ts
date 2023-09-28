import { registerAs } from '@nestjs/config';

export const marketsApiConfig = registerAs('marketsApi', () => ({
  url: process.env.MARKETS_SERVICE_API_URL,
}));
