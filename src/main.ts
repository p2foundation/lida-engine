import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SERVER_PORT } from './constants';

async function bootstrap() {
  const logger = new Logger('bootstrap');
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');

  app.enableCors();

  const port = process.env.PORT || SERVER_PORT;
  await app.listen(port);
  logger.debug(`Application listening on port ${port}`);
}
bootstrap();
