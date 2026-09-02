import { ReminderEntity } from '../../core/domain/entities/reminder.entity';
import { CreateReminderCommand, ICreateReminderUseCase } from '../ports/in/create-reminder.use-case';
import { IReminderRepositoryPort } from '../ports/out/reminder-repository.port';

export class CreateReminderInteractor implements ICreateReminderUseCase {
  constructor(private readonly reminderRepository: IReminderRepositoryPort) {}

  async execute(command: CreateReminderCommand): Promise<ReminderEntity> {
    const reminder = new ReminderEntity({
      title: command.title,
      description: command.description,
      scheduledAt: command.scheduledAt,
      priority: command.priority,
    });

    return await this.reminderRepository.save(reminder);
  }
}

