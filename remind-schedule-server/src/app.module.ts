import { Module } from '@nestjs/common';
import { PrismaModule } from './common/database/prisma.module';
import { I18nModule } from './common/i18n/i18n.module';
import { AuthModule } from './modules/auth/auth.module';
import { ReminderModule } from './modules/reminder/reminder.module';

@Module({
  imports: [I18nModule, PrismaModule, AuthModule, ReminderModule],
})
export class AppModule {}
