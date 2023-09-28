import * as joi from 'joi';

export const envValidationSchema = joi.object({
  ENVIRONMENT: joi.string().valid('development', 'production').optional(),

  BULLMQ_REDIS_HOST: joi.string().required(),
  BULLMQ_REDIS_PORT: joi.number().required(),

  MARKETS_SERVICE_API_URL: joi.string().required(),
});
