import { IDeleteReminderUseCase } from '../ports/in/delete-reminder.use-case';
import { IReminderRepositoryPort } from '../ports/out/reminder-repository.port';

export class DeleteReminderInteractor implements IDeleteReminderUseCase {
  constructor(private readonly reminderRepository: IReminderRepositoryPort) {}

  async execute(id: string): Promise<void> {
    const existing = await this.reminderRepository.findById(id);
    if (!existing) {
      throw new Error(`Reminder with ID "${id}" not found`);
    }

    await this.reminderRepository.delete(id);
  }
}

