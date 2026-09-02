export interface IDeleteReminderUseCase {
  execute(id: string): Promise<void>;
}

