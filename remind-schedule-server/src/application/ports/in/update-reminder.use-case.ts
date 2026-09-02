import { ReminderEntity } from '../../../core/domain/entities/reminder.entity';
import { ReminderPriority } from '../../../core/domain/enums/reminder-priority.enum';
import { ReminderStatus } from '../../../core/domain/enums/reminder-status.enum';

export interface UpdateReminderCommand {
  id: string;
  title?: string;
  description?: string;
  scheduledAt?: Date;
  priority?: ReminderPriority;
  status?: ReminderStatus;
}

export interface IUpdateReminderUseCase {
  execute(command: UpdateReminderCommand): Promise<ReminderEntity>;
}

