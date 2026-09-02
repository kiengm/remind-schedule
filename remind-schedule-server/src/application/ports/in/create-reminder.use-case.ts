import { ReminderEntity } from '../../../core/domain/entities/reminder.entity';
import { ReminderPriority } from '../../../core/domain/enums/reminder-priority.enum';

export interface CreateReminderCommand {
  title: string;
  description?: string;
  scheduledAt: Date;
  priority?: ReminderPriority;
}

export interface ICreateReminderUseCase {
  execute(command: CreateReminderCommand): Promise<ReminderEntity>;
}

