import * as joi from 'joi';

export const envValidationSchema = joi.object({
  ENVIRONMENT: joi.string().valid('development', 'production').optional(),
  MARKETPLACE_TWITTER_AUTH_BEARER_TOKEN: joi.string().required(),

  POSTGRES_HOST: joi.string().required(),
  POSTGRES_PORT: joi.number().required(),
  POSTGRES_USER: joi.string().required(),
  POSTGRES_PASSWORD: joi.string().required(),
  POSTGRES_DATABASE: joi.string().required(),

  BULLMQ_REDIS_HOST: joi.string().required(),
  BULLMQ_REDIS_PORT: joi.number().required(),

  MARKETS_SERVICE_API_URL: joi.string().required(),
});
