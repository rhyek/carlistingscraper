import { ScraperModule } from '@app/scraper';
import { Module } from '@nestjs/common';
@Module({
  imports: [ScraperModule],
  controllers: [],
  providers: [],
})
export class LambdaModule {}
