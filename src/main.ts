import { NestFactory } from '@nestjs/core';
import * as morgan from 'morgan';
import { AppModule } from './app/app.module';
import {
  ApplicationReadiness,
  initWinston,
  winstonLogger,
} from './common/utilities';

async function bootstrap() {
  initWinston('From Main.ts', 'initializing...');

  const app = await NestFactory.create(AppModule, {
    logger: ['log', 'error', 'warn', 'debug', 'verbose'],
  });

  app.enableCors();
  app.setGlobalPrefix('appcake/v1.0/api');
  app.use(morgan('tiny'));

  const port = process.env.PORT || 8080;

  await app.listen(port);

  const url = await app.getUrl();
  winstonLogger?.info(
    `🚀 Application is running on port: ${url}/appcake/v1.0/api`,
  );
  ApplicationReadiness.getInstance().isReady = true;
}
bootstrap();
