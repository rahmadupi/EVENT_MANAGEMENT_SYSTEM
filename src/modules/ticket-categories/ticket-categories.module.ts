import { Module } from '@nestjs/common';
import { TicketCategoriesController } from './ticket-categories.controller';
import { TicketCategoriesService } from './ticket-categories.service';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [AuthModule],
  controllers: [TicketCategoriesController],
  providers: [TicketCategoriesService],
  exports: [TicketCategoriesService],
})
export class TicketCategoriesModule {}
