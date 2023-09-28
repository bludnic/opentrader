import * as joi from 'joi';

export const envValidationSchema = joi.object({
  ENVIRONMENT: joi.string().valid('development', 'production').optional(),
});
