import { ScraperService } from '@app/scraper';
import { NestFactory } from '@nestjs/core';
import { Handler, SQSEvent } from 'aws-lambda';
import { LambdaModule } from './lambda.module';

let scraperService: ScraperService;

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(LambdaModule);
  return app.get(ScraperService);
}

export const handler: Handler<SQSEvent> = async () => {
  scraperService ??= await bootstrap();
  await scraperService.run();
};
