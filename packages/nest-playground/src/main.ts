import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
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

  await app.listen(4000);
}
bootstrap();
