import { registerAs } from '@nestjs/config';

export const bullMQConfig = registerAs('bullmq', () => ({
  host: process.env.BULLMQ_REDIS_HOST,
  port: Number(process.env.BULLMQ_REDIS_PORT),
}));
