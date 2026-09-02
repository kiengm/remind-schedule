import { UserEntity } from '../../core/domain/entities/user.entity';
import { Role } from '../../core/domain/enums/role.enum';

export interface UserViewModel {
  id: string;
  email: string;
  name: string;
  phone: string | null;
  avatar: string | null;
  role: Role;
  isActive: boolean;
  createdAt: string;
}

export interface AuthResponseViewModel {
  user: UserViewModel;
  accessToken: string;
}

export class AuthPresenter {
  static toUserViewModel(entity: UserEntity): UserViewModel {
    return {
      id: entity.id,
      email: entity.email,
      name: entity.name,
      phone: entity.phone,
      avatar: entity.avatar,
      role: entity.role,
      isActive: entity.isActive,
      createdAt: entity.createdAt.toISOString(),
    };
  }

  static toAuthResponse(userEntity: UserEntity, accessToken: string): AuthResponseViewModel {
    return {
      user: this.toUserViewModel(userEntity),
      accessToken,
    };
  }
}

