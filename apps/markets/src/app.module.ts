import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ApiModule } from 'src/api/api.module';

import { postgresConfig } from 'src/config/postgres.config';
import { envValidationSchema } from 'src/config/utils/envValidationSchema';
import { getTypeOrmConfig } from 'src/config/utils/getTypeOrmConfig';
import { CoreModule } from 'src/core/core.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['.env.development', '.env.development.local'],
      load: [postgresConfig],
      validationSchema: envValidationSchema,
      isGlobal: true,
    }),
    TypeOrmModule.forRoot(getTypeOrmConfig()),
    ScheduleModule.forRoot(),
    CoreModule,
    ApiModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
