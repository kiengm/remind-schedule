import { ReminderEntity } from '../../../core/domain/entities/reminder.entity';

export interface IGetRemindersUseCase {
  findAll(): Promise<ReminderEntity[]>;
  findById(id: string): Promise<ReminderEntity>;
}

