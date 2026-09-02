import { Module } from '@nestjs/common';
import { ReminderController } from '../adapters/controllers/reminder.controller';
import { InMemoryReminderRepository } from '../adapters/gateways/in-memory-reminder.repository';
import { CreateReminderInteractor } from '../application/use-cases/create-reminder.interactor';
import { GetRemindersInteractor } from '../application/use-cases/get-reminders.interactor';
import { UpdateReminderInteractor } from '../application/use-cases/update-reminder.interactor';
import { DeleteReminderInteractor } from '../application/use-cases/delete-reminder.interactor';
import { IReminderRepositoryPort } from '../application/ports/out/reminder-repository.port';
import {
  CREATE_REMINDER_USE_CASE,
  DELETE_REMINDER_USE_CASE,
  GET_REMINDERS_USE_CASE,
  REMINDER_REPOSITORY,
  UPDATE_REMINDER_USE_CASE,
} from './reminder.tokens';

@Module({
  controllers: [ReminderController],
  providers: [
    // Reminder tạm thời chạy InMemory để DB MySQL chỉ tập trung vào bảng users
    {
      provide: REMINDER_REPOSITORY,
      useClass: InMemoryReminderRepository,
    },

    // 2. Use Cases Interactors (Input Port Implementations)
    {
      provide: CREATE_REMINDER_USE_CASE,
      useFactory: (repo: IReminderRepositoryPort) => new CreateReminderInteractor(repo),
      inject: [REMINDER_REPOSITORY],
    },
    {
      provide: GET_REMINDERS_USE_CASE,
      useFactory: (repo: IReminderRepositoryPort) => new GetRemindersInteractor(repo),
      inject: [REMINDER_REPOSITORY],
    },
    {
      provide: UPDATE_REMINDER_USE_CASE,
      useFactory: (repo: IReminderRepositoryPort) => new UpdateReminderInteractor(repo),
      inject: [REMINDER_REPOSITORY],
    },
    {
      provide: DELETE_REMINDER_USE_CASE,
      useFactory: (repo: IReminderRepositoryPort) => new DeleteReminderInteractor(repo),
      inject: [REMINDER_REPOSITORY],
    },
  ],
  exports: [
    REMINDER_REPOSITORY,
    CREATE_REMINDER_USE_CASE,
    GET_REMINDERS_USE_CASE,
    UPDATE_REMINDER_USE_CASE,
    DELETE_REMINDER_USE_CASE,
  ],
})
export class ReminderModule {}

