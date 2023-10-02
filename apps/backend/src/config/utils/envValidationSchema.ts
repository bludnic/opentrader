import z from 'zod';

const envSchema = z.object({
  ENVIRONMENT: z.enum(['development', 'production']),
  MARKETS_SERVICE_API_URL: z.string().min(1),
});

/**
 * Custom validation handler for `@nestjs/config`
 */
export const envValidation = {
  validate: (env: unknown) => envSchema.parse(env),
};
