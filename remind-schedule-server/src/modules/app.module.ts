import { Module } from '@nestjs/common';
import { ReminderModule } from './reminder.module';
import { AuthModule } from './auth.module';

@Module({
  imports: [AuthModule, ReminderModule],
})
export class AppModule {}
