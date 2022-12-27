import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { OkxApiExceptionFilter } from 'src/core/exchanges/okx/utils/errors/okx-api-exception.filter';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const logger = app.get(WINSTON_MODULE_NEST_PROVIDER);

  app.useLogger(logger);
  app.setGlobalPrefix('bapi');
  app.enableCors();

  // Swagger configuration
  const config = new DocumentBuilder()
    .setTitle('Bifrost Swagger UI')
    .setDescription(
      'Bifrost API Schema <a href="/bapi/swagger-json" target="_blank">schema.json</a>',
    )
    .setVersion('dev')
    .build();
  const document = SwaggerModule.createDocument(app, config, {
    operationIdFactory: (controllerKey: string, methodKey: string) => methodKey,
  });
  SwaggerModule.setup('bapi/swagger', app, document);

  app.enableShutdownHooks();
  app.useGlobalPipes(
    new ValidationPipe({
      forbidNonWhitelisted: true,
      whitelist: true,
    }),
  );

  app.useGlobalFilters(new OkxApiExceptionFilter(logger));
  // app.useGlobalFilters(new HttpExceptionFilter());

  await app.listen(4000);
}
bootstrap();
