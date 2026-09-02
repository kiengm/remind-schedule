import { ReminderEntity } from '../../core/domain/entities/reminder.entity';
import { ReminderPriority } from '../../core/domain/enums/reminder-priority.enum';
import { ReminderStatus } from '../../core/domain/enums/reminder-status.enum';

export interface ReminderViewModel {
  id: string;
  title: string;
  description: string;
  scheduledAt: string;
  priority: ReminderPriority;
  status: ReminderStatus;
  isOverdue: boolean;
  createdAt: string;
  updatedAt: string;
}

export class ReminderPresenter {
  static toViewModel(entity: ReminderEntity): ReminderViewModel {
    return {
      id: entity.id,
      title: entity.title,
      description: entity.description,
      scheduledAt: entity.scheduledAt.toISOString(),
      priority: entity.priority,
      status: entity.status,
      isOverdue: entity.isOverdue(),
      createdAt: entity.createdAt.toISOString(),
      updatedAt: entity.updatedAt.toISOString(),
    };
  }

  static toViewModelList(entities: ReminderEntity[]): ReminderViewModel[] {
    return entities.map((entity) => this.toViewModel(entity));
  }
}

