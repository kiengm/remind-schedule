import { Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { User as PrismaUser, Role as PrismaRole } from '@prisma/client';
import { UserEntity } from '../../core/domain/entities/user.entity';
import { Role } from '../../core/domain/enums/role.enum';
import { IUserRepositoryPort } from '../../application/ports/out/user-repository.port';
import { PrismaService } from '../../infrastructure/database/prisma/prisma.service';

@Injectable()
export class PrismaUserRepository implements IUserRepositoryPort {
  constructor(private readonly prisma: PrismaService) {}

  async save(user: UserEntity): Promise<UserEntity> {
    const id = user.id || uuidv4();
    const created = await this.prisma.user.create({
      data: {
        id,
        email: user.email,
        password: user.password,
        name: user.name,
        phone: user.phone,
        avatar: user.avatar,
        role: user.role as PrismaRole,
        isActive: user.isActive,
      },
    });

    return this.toDomain(created);
  }

  async findById(id: string): Promise<UserEntity | null> {
    const record = await this.prisma.user.findUnique({
      where: { id },
    });
    return record ? this.toDomain(record) : null;
  }

  async findByEmail(email: string): Promise<UserEntity | null> {
    const record = await this.prisma.user.findUnique({
      where: { email: email.toLowerCase().trim() },
    });
    return record ? this.toDomain(record) : null;
  }

  async findByPhone(phone: string): Promise<UserEntity | null> {
    const record = await this.prisma.user.findFirst({
      where: { phone: phone.trim() },
    });
    return record ? this.toDomain(record) : null;
  }

  async update(user: UserEntity): Promise<UserEntity> {
    const updated = await this.prisma.user.update({
      where: { id: user.id },
      data: {
        name: user.name,
        phone: user.phone,
        password: user.password,
        avatar: user.avatar,
        role: user.role as PrismaRole,
        isActive: user.isActive,
      },
    });

    return this.toDomain(updated);
  }

  // Data Mapper: Prisma User Model -> Core Domain UserEntity
  private toDomain(record: PrismaUser): UserEntity {
    return new UserEntity({
      id: record.id,
      email: record.email,
      password: record.password,
      name: record.name,
      phone: record.phone,
      avatar: record.avatar,
      role: record.role as unknown as Role,
      isActive: record.isActive,
      createdAt: record.createdAt,
      updatedAt: record.updatedAt,
    });
  }
}

