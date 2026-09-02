import { UserEntity } from '../../../core/domain/entities/user.entity';

export interface IUserRepositoryPort {
  save(user: UserEntity): Promise<UserEntity>;
  findById(id: string): Promise<UserEntity | null>;
  findByEmail(email: string): Promise<UserEntity | null>;
  findByPhone(phone: string): Promise<UserEntity | null>;
  update(user: UserEntity): Promise<UserEntity>;
}

