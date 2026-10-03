import { Role } from './role.enum';

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
  refreshToken: string;
}

export interface TokensViewModel {
  accessToken: string;
  refreshToken: string;
}

export interface CreateUserProps {
  id?: string;
  email: string;
  password: string;
  name: string;
  phone?: string | null;
  avatar?: string | null;
  role?: Role;
  isActive?: boolean;
  refreshTokenHash?: string | null;
  createdAt?: Date;
  updatedAt?: Date;
}

export class UserEntity {
  private readonly _id: string;
  private _email: string;
  private _password: string;
  private _name: string;
  private _phone: string | null;
  private _avatar: string | null;
  private _role: Role;
  private _isActive: boolean;
  private _refreshTokenHash: string | null;
  private readonly _createdAt: Date;
  private _updatedAt: Date;

  constructor(props: CreateUserProps) {
    if (!props.email || !this.isValidEmail(props.email)) {
      throw new Error('Email không hợp lệ');
    }
    if (!props.name || props.name.trim().length === 0) {
      throw new Error('Tên không được để trống');
    }
    if (!props.password) {
      throw new Error('Mật khẩu không được để trống');
    }

    this._id = props.id || '';
    this._email = props.email.toLowerCase().trim();
    this._password = props.password;
    this._name = props.name.trim();
    this._phone = props.phone?.trim() || null;
    this._avatar = props.avatar?.trim() || null;
    this._role = props.role || Role.USER;
    this._isActive = props.isActive !== undefined ? props.isActive : true;
    this._refreshTokenHash = props.refreshTokenHash || null;
    this._createdAt = props.createdAt ? new Date(props.createdAt) : new Date();
    this._updatedAt = props.updatedAt ? new Date(props.updatedAt) : new Date();
  }

  get id(): string {
    return this._id;
  }

  get email(): string {
    return this._email;
  }

  get password(): string {
    return this._password;
  }

  get name(): string {
    return this._name;
  }

  get phone(): string | null {
    return this._phone;
  }

  get avatar(): string | null {
    return this._avatar;
  }

  get role(): Role {
    return this._role;
  }

  get isActive(): boolean {
    return this._isActive;
  }

  get refreshTokenHash(): string | null {
    return this._refreshTokenHash;
  }

  get createdAt(): Date {
    return this._createdAt;
  }

  get updatedAt(): Date {
    return this._updatedAt;
  }

  public toViewModel(): UserViewModel {
    return {
      id: this._id,
      email: this._email,
      name: this._name,
      phone: this._phone,
      avatar: this._avatar,
      role: this._role,
      isActive: this._isActive,
      createdAt: this._createdAt.toISOString(),
    };
  }

  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
}
