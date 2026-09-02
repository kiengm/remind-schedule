import { ReminderEntity } from '../../core/domain/entities/reminder.entity';
import { IGetRemindersUseCase } from '../ports/in/get-reminders.use-case';
import { IReminderRepositoryPort } from '../ports/out/reminder-repository.port';

export class GetRemindersInteractor implements IGetRemindersUseCase {
  constructor(private readonly reminderRepository: IReminderRepositoryPort) {}

  async findAll(): Promise<ReminderEntity[]> {
    return await this.reminderRepository.findAll();
  }

  async findById(id: string): Promise<ReminderEntity> {
    const reminder = await this.reminderRepository.findById(id);
    if (!reminder) {
      throw new Error(`Reminder with ID "${id}" not found`);
    }
    return reminder;
  }
}

