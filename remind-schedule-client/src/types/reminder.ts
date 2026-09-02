export type ReminderStatus = 'PENDING' | 'COMPLETED' | 'CANCELLED';

export type ReminderPriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';

export interface Reminder {
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

export interface CreateReminderPayload {
  title: string;
  description?: string;
  scheduledAt: string;
  priority?: ReminderPriority;
}

export interface UpdateReminderPayload {
  title?: string;
  description?: string;
  scheduledAt?: string;
  priority?: ReminderPriority;
  status?: ReminderStatus;
}

export interface ApiResponse<T> {
  success: boolean;
  statusCode: number;
  data: T;
  timestamp: string;
}

