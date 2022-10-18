import { ScraperService } from '@app/scraper';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const service = app.get(ScraperService);
  await service.run();
}
bootstrap();
