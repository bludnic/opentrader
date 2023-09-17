// IMPORTANT:
// This file is used directly by TypeORM CLI
// Don't import it into the project
import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';
import * as path from 'path';

// TypeORM CLI doesn't recognize absolute paths so keep these imports as relative
import { postgresConfig } from './postgres.config';
import { entities } from '../core/db/entities';

const envFileName =
  process.env.NODE_ENV !== 'production' ? '.env.development.local' : '.env';
const envFilePath = path.resolve(__dirname, '../../', envFileName);

dotenv.config({
  path: envFilePath,
});

const config = postgresConfig();

export default new DataSource({
  type: 'postgres',
  host: config.host,
  port: config.port,
  username: config.user,
  password: config.password,
  database: config.database,
  entities,
});
