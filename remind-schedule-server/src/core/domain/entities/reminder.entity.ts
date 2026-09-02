import { ReminderPriority } from '../enums/reminder-priority.enum';
import { ReminderStatus } from '../enums/reminder-status.enum';

export interface CreateReminderProps {
  id?: string;
  title: string;
  description?: string;
  scheduledAt: Date;
  priority?: ReminderPriority;
  status?: ReminderStatus;
  createdAt?: Date;
  updatedAt?: Date;
}

export class ReminderEntity {
  private readonly _id: string;
  private _title: string;
  private _description: string;
  private _scheduledAt: Date;
  private _priority: ReminderPriority;
  private _status: ReminderStatus;
  private readonly _createdAt: Date;
  private _updatedAt: Date;

  constructor(props: CreateReminderProps) {
    if (!props.title || props.title.trim().length === 0) {
      throw new Error('Title cannot be empty');
    }

    this._id = props.id || '';
    this._title = props.title.trim();
    this._description = props.description?.trim() || '';
    this._scheduledAt = new Date(props.scheduledAt);
    this._priority = props.priority || ReminderPriority.MEDIUM;
    this._status = props.status || ReminderStatus.PENDING;
    this._createdAt = props.createdAt ? new Date(props.createdAt) : new Date();
    this._updatedAt = props.updatedAt ? new Date(props.updatedAt) : new Date();
  }

  get id(): string {
    return this._id;
  }

  get title(): string {
    return this._title;
  }

  get description(): string {
    return this._description;
  }

  get scheduledAt(): Date {
    return this._scheduledAt;
  }

  get priority(): ReminderPriority {
    return this._priority;
  }

  get status(): ReminderStatus {
    return this._status;
  }

  get createdAt(): Date {
    return this._createdAt;
  }

  get updatedAt(): Date {
    return this._updatedAt;
  }

  // Domain Business Rules / Invariants
  public markAsCompleted(): void {
    if (this._status === ReminderStatus.CANCELLED) {
      throw new Error('Cannot complete a cancelled reminder');
    }
    this._status = ReminderStatus.COMPLETED;
    this._updatedAt = new Date();
  }

  public cancel(): void {
    if (this._status === ReminderStatus.COMPLETED) {
      throw new Error('Cannot cancel a completed reminder');
    }
    this._status = ReminderStatus.CANCELLED;
    this._updatedAt = new Date();
  }

  public reschedule(newTime: Date): void {
    if (this._status === ReminderStatus.COMPLETED) {
      throw new Error('Cannot reschedule an already completed reminder');
    }
    this._scheduledAt = new Date(newTime);
    this._status = ReminderStatus.PENDING;
    this._updatedAt = new Date();
  }

  public updateDetails(title?: string, description?: string, priority?: ReminderPriority): void {
    if (title !== undefined) {
      if (!title || title.trim().length === 0) {
        throw new Error('Title cannot be empty');
      }
      this._title = title.trim();
    }
    if (description !== undefined) {
      this._description = description.trim();
    }
    if (priority !== undefined) {
      this._priority = priority;
    }
    this._updatedAt = new Date();
  }

  public isOverdue(): boolean {
    return (
      this._status === ReminderStatus.PENDING &&
      this._scheduledAt.getTime() < Date.now()
    );
  }
}

