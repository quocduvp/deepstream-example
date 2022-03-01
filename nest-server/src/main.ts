require("dotenv").config();
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DsAdapter } from './transporters/ds-adapter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useWebSocketAdapter(new DsAdapter(app));

  await app.listen(3000);
}
bootstrap();
