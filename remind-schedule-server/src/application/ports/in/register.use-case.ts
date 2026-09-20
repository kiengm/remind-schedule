import { UserEntity } from '../../../core/domain/entities/user.entity';

export interface RegisterCommand {
  name: string;
  email: string;
  password: string;
  phone?: string | null;
}

export interface AuthResult {
  user: UserEntity;
  accessToken: string;
  refreshToken: string;
}

export interface IRegisterUseCase {
  execute(command: RegisterCommand): Promise<AuthResult>;
}
