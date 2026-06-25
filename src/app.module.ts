import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { EventsModule } from './modules/events/events.module';
import { TicketCategoriesModule } from './modules/ticket-categories/ticket-categories.module';

@Module({
  imports: [AuthModule, UsersModule, EventsModule, TicketCategoriesModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
