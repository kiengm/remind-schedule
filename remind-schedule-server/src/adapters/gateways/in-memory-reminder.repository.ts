import { v4 as uuidv4 } from 'uuid';
import { ReminderEntity } from '../../core/domain/entities/reminder.entity';
import { IReminderRepositoryPort } from '../../application/ports/out/reminder-repository.port';

export class InMemoryReminderRepository implements IReminderRepositoryPort {
  private readonly items: Map<string, ReminderEntity> = new Map();

  constructor() {
    // Seed initial data for demo
    const sample = new ReminderEntity({
      id: uuidv4(),
      title: 'Họp kế hoạch tuần mới',
      description: 'Review tiến độ các dự án và phân công task tuần này.',
      scheduledAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    this.items.set(sample.id, sample);
  }

  async save(reminder: ReminderEntity): Promise<ReminderEntity> {
    const id = reminder.id || uuidv4();
    const entity = new ReminderEntity({
      id,
      title: reminder.title,
      description: reminder.description,
      scheduledAt: reminder.scheduledAt,
      priority: reminder.priority,
      status: reminder.status,
      createdAt: reminder.createdAt || new Date(),
      updatedAt: new Date(),
    });

    this.items.set(id, entity);
    return entity;
  }

  async findById(id: string): Promise<ReminderEntity | null> {
    const entity = this.items.get(id);
    return entity || null;
  }

  async findAll(): Promise<ReminderEntity[]> {
    return Array.from(this.items.values()).sort(
      (a, b) => a.scheduledAt.getTime() - b.scheduledAt.getTime()
    );
  }

  async update(reminder: ReminderEntity): Promise<ReminderEntity> {
    this.items.set(reminder.id, reminder);
    return reminder;
  }

  async delete(id: string): Promise<boolean> {
    return this.items.delete(id);
  }
}

