import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { postgresConfig } from 'src/config/postgres.config';
import { entities } from 'src/core/db/entities';

export function getTypeOrmConfig(): TypeOrmModuleOptions {
  const postgres = postgresConfig();

  return {
    type: 'postgres',
    host: postgres.host,
    port: postgres.port,
    username: postgres.user,
    password: postgres.password,
    database: postgres.database,

    entities,
    migrationsTableName: 'migrations',
    migrations: ['src/core/db/postgres/migrations/*.ts'],
  };
}
