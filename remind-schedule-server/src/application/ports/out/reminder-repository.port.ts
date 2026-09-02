import { ReminderEntity } from '../../../core/domain/entities/reminder.entity';

export interface IReminderRepositoryPort {
  save(reminder: ReminderEntity): Promise<ReminderEntity>;
  findById(id: string): Promise<ReminderEntity | null>;
  findAll(): Promise<ReminderEntity[]>;
  update(reminder: ReminderEntity): Promise<ReminderEntity>;
  delete(id: string): Promise<boolean>;
}

