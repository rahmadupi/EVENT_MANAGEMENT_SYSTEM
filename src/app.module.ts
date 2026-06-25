import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { EventsModule } from './modules/events/events.module';
import { TicketCategoriesModule } from './modules/ticket-categories/ticket-categories.module';
import { BookingsModule } from './modules/bookings/bookings.module';

@Module({
  imports: [AuthModule, UsersModule, EventsModule, TicketCategoriesModule, BookingsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
