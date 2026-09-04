import { Module } from '@nestjs/common';
import { PrismaModule } from '../infrastructure/database/prisma/prisma.module';
import { ReminderModule } from './reminder.module';
import { AuthModule } from './auth.module';
import { I18nModule } from '../infrastructure/i18n/i18n.module';

@Module({
  imports: [I18nModule, PrismaModule, AuthModule, ReminderModule],
})

export class AppModule {}
