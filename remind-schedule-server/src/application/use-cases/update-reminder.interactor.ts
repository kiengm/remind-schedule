import { ReminderEntity } from '../../core/domain/entities/reminder.entity';
import { ReminderStatus } from '../../core/domain/enums/reminder-status.enum';
import { IUpdateReminderUseCase, UpdateReminderCommand } from '../ports/in/update-reminder.use-case';
import { IReminderRepositoryPort } from '../ports/out/reminder-repository.port';

export class UpdateReminderInteractor implements IUpdateReminderUseCase {
  constructor(private readonly reminderRepository: IReminderRepositoryPort) {}

  async execute(command: UpdateReminderCommand): Promise<ReminderEntity> {
    const existing = await this.reminderRepository.findById(command.id);
    if (!existing) {
      throw new Error(`Reminder with ID "${command.id}" not found`);
    }

    if (command.title !== undefined || command.description !== undefined || command.priority !== undefined) {
      existing.updateDetails(command.title, command.description, command.priority);
    }

    if (command.scheduledAt !== undefined) {
      existing.reschedule(command.scheduledAt);
    }

    if (command.status !== undefined) {
      if (command.status === ReminderStatus.COMPLETED) {
        existing.markAsCompleted();
      } else if (command.status === ReminderStatus.CANCELLED) {
        existing.cancel();
      }
    }

    return await this.reminderRepository.update(existing);
  }
}

