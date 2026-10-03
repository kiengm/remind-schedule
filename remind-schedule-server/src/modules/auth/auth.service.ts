import { Injectable, BadRequestException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import { PrismaService } from '../../common/database/prisma.service';
import { Role as PrismaRole } from '@prisma/client';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import {
  AuthResponseViewModel,
  Role,
  TokensViewModel,
  UserViewModel,
} from './entities/user.entity';

@Injectable()
export class AuthService {
  private readonly saltRounds = 10;

  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async register(dto: RegisterDto): Promise<AuthResponseViewModel> {
    const email = dto.email.toLowerCase().trim();

    // 1. Kiểm tra email đã tồn tại chưa
    const existingEmail = await this.prisma.user.findUnique({
      where: { email },
    });
    if (existingEmail) {
      throw new BadRequestException(
        `Email "${dto.email}" đã được sử dụng. Vui lòng chọn email khác`,
      );
    }

    // 2. Kiểm tra số điện thoại (nếu có)
    if (dto.phone) {
      const existingPhone = await this.prisma.user.findFirst({
        where: { phone: dto.phone.trim() },
      });
      if (existingPhone) {
        throw new BadRequestException(`Số điện thoại "${dto.phone}" đã được sử dụng`);
      }
    }

    // 3. Hash mật khẩu
    const hashedPassword = await bcrypt.hash(dto.password, this.saltRounds);

    // 4. Lưu vào Database
    const id = uuidv4();
    const createdUser = await this.prisma.user.create({
      data: {
        id,
        email,
        password: hashedPassword,
        name: dto.name.trim(),
        phone: dto.phone?.trim() || null,
        role: PrismaRole.USER,
        isActive: true,
      },
    });

    // 5. Sinh cặp JWT Tokens
    const { accessToken, refreshToken } = await this.generateTokens({
      userId: createdUser.id,
      email: createdUser.email,
      role: createdUser.role,
    });

    // 6. Hash Refresh Token và cập nhật vào Database
    const hashedRefreshToken = await bcrypt.hash(refreshToken, this.saltRounds);
    await this.prisma.user.update({
      where: { id: createdUser.id },
      data: { refreshTokenHash: hashedRefreshToken },
    });

    return {
      user: this.toUserViewModel(createdUser),
      accessToken,
      refreshToken,
    };
  }

  async login(dto: LoginDto): Promise<AuthResponseViewModel> {
    const email = dto.email.toLowerCase().trim();

    // 1. Tìm tài khoản
    const user = await this.prisma.user.findUnique({
      where: { email },
    });
    if (!user) {
      throw new BadRequestException('auth.emailPasswordInvalid');
    }

    // 2. Kiểm tra trạng thái hoạt động
    if (!user.isActive) {
      throw new BadRequestException('auth.userDisabled');
    }

    // 3. So khớp mật khẩu
    const isPasswordValid = await bcrypt.compare(dto.password, user.password);
    if (!isPasswordValid) {
      throw new BadRequestException('auth.emailPasswordInvalid');
    }

    // 4. Sinh cặp JWT Tokens
    const { accessToken, refreshToken } = await this.generateTokens({
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    // 5. Cập nhật hashed refresh token vào Database
    const hashedRefreshToken = await bcrypt.hash(refreshToken, this.saltRounds);
    await this.prisma.user.update({
      where: { id: user.id },
      data: { refreshTokenHash: hashedRefreshToken },
    });

    return {
      user: this.toUserViewModel(user),
      accessToken,
      refreshToken,
    };
  }

  async refreshToken(rawRefreshToken: string): Promise<TokensViewModel> {
    if (!rawRefreshToken) {
      throw new BadRequestException('auth.refreshTokenRequired');
    }

    // 1. Verify Refresh Token
    let payload: any;
    try {
      payload = await this.jwtService.verifyAsync(rawRefreshToken, {
        secret: process.env.JWT_SECRET || 'remind_schedule_super_secret_jwt_key_2026',
      });
      if (payload?.type && payload.type !== 'refresh') {
        throw new Error('Invalid token type');
      }
    } catch {
      throw new UnauthorizedException('auth.refreshTokenInvalid');
    }

    // 2. Tìm người dùng
    const user = await this.prisma.user.findUnique({
      where: { id: payload.sub },
    });
    if (!user) {
      throw new UnauthorizedException('auth.userNotFound');
    }
    if (!user.isActive) {
      throw new UnauthorizedException('auth.userDisabled');
    }
    if (!user.refreshTokenHash) {
      throw new UnauthorizedException('auth.refreshTokenRevoked');
    }

    // 3. So khớp hash
    const isMatch = await bcrypt.compare(rawRefreshToken, user.refreshTokenHash);
    if (!isMatch) {
      throw new UnauthorizedException('auth.refreshTokenInvalid');
    }

    // 4. Cơ chế Rotation: Sinh cặp token mới
    const { accessToken, refreshToken: newRefreshToken } = await this.generateTokens({
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    // 5. Lưu hashed refresh token mới
    const newHashed = await bcrypt.hash(newRefreshToken, this.saltRounds);
    await this.prisma.user.update({
      where: { id: user.id },
      data: { refreshTokenHash: newHashed },
    });

    return {
      accessToken,
      refreshToken: newRefreshToken,
    };
  }

  async logout(userId: string): Promise<void> {
    if (!userId) return;
    await this.prisma.user.update({
      where: { id: userId },
      data: { refreshTokenHash: null },
    });
  }

  async getProfile(userId: string): Promise<UserViewModel> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });
    if (!user) {
      throw new BadRequestException('auth.userNotFound');
    }
    return this.toUserViewModel(user);
  }

  private async generateTokens(payload: { userId: string; email: string; role: string }) {
    const secret = process.env.JWT_SECRET || 'remind_schedule_super_secret_jwt_key_2026';
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(
        {
          sub: payload.userId,
          email: payload.email,
          role: payload.role,
          type: 'access',
        },
        { expiresIn: '15m', secret },
      ),
      this.jwtService.signAsync(
        {
          sub: payload.userId,
          email: payload.email,
          role: payload.role,
          type: 'refresh',
        },
        { expiresIn: '7d', secret },
      ),
    ]);

    return { accessToken, refreshToken };
  }

  private toUserViewModel(record: any): UserViewModel {
    return {
      id: record.id,
      email: record.email,
      name: record.name,
      phone: record.phone,
      avatar: record.avatar,
      role: record.role as Role,
      isActive: record.isActive,
      createdAt:
        record.createdAt instanceof Date ? record.createdAt.toISOString() : record.createdAt,
    };
  }
}
