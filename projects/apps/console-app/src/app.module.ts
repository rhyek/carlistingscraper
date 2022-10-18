import { ScraperModule } from '@app/scraper';
import { Module } from '@nestjs/common';

@Module({
  imports: [ScraperModule],
  providers: [],
})
export class AppModule {}
