import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { ApiModule } from 'src/api/api.module';

import { envValidationSchema } from 'src/config/utils/envValidationSchema';
import { CoreModule } from 'src/core/core.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['.env.development', '.env.development.local'],
      load: [],
      validationSchema: envValidationSchema,
      isGlobal: true,
    }),
    ScheduleModule.forRoot(),
    CoreModule,
    ApiModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
