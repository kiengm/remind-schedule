import { Role } from '../enums/role.enum';

export interface CreateUserProps {
  id?: string;
  email: string;
  password: string; // Hashed password
  name: string;
  phone?: string | null;
  avatar?: string | null;
  role?: Role;
  isActive?: boolean;
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

  get createdAt(): Date {
    return this._createdAt;
  }

  get updatedAt(): Date {
    return this._updatedAt;
  }

  // Domain Logic & Invariants
  public updateProfile(name?: string, phone?: string | null, avatar?: string | null): void {
    if (name !== undefined) {
      if (!name || name.trim().length === 0) {
        throw new Error('Tên không được để trống');
      }
      this._name = name.trim();
    }
    if (phone !== undefined) {
      this._phone = phone ? phone.trim() : null;
    }
    if (avatar !== undefined) {
      this._avatar = avatar ? avatar.trim() : null;
    }
    this._updatedAt = new Date();
  }

  public changePassword(newHashedPassword: string): void {
    if (!newHashedPassword) {
      throw new Error('Mật khẩu mới không được để trống');
    }
    this._password = newHashedPassword;
    this._updatedAt = new Date();
  }

  public deactivate(): void {
    this._isActive = false;
    this._updatedAt = new Date();
  }

  public activate(): void {
    this._isActive = true;
    this._updatedAt = new Date();
  }

  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
}

