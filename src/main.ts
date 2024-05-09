import { ValidationPipe, VersioningType } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: ['1'],
  });
  app.setGlobalPrefix('/api');
  const config = app.get(ConfigService);

  await app.listen(config.get('APP_PORT'));
  console.log(`App is running at: ${config.get('APP_PORT')}`);
}
bootstrap();
