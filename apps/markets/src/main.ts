import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { GLOBAL_PREFIX } from 'src/common/constants';
import { loadMarkets } from './load-markets';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix(GLOBAL_PREFIX);

  // Swagger configuration
  const config = new DocumentBuilder()
    .setTitle('Bifrost Markets API')
    .setDescription(
      `<a href="/${GLOBAL_PREFIX}/swagger-json" target="_blank">schema.json</a>`,
    )
    .setVersion('dev')
    .build();
  const document = SwaggerModule.createDocument(app, config, {
    operationIdFactory: (controllerKey: string, methodKey: string) => methodKey,
  });
  SwaggerModule.setup(`${GLOBAL_PREFIX}/swagger`, app, document);

  app.enableShutdownHooks();
  app.useGlobalPipes(
    new ValidationPipe({
      forbidNonWhitelisted: true,
      whitelist: true,
    }),
  );

  await loadMarkets();
  console.log('exchanges: Markets loaded and cached');

  await app.listen(5000);
}
bootstrap();
