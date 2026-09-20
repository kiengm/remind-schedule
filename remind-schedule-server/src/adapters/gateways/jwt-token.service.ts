import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import {
  AuthTokens,
  ITokenServicePort,
  TokenPayload,
} from '../../application/ports/out/token-service.port';

@Injectable()
export class JwtTokenService implements ITokenServicePort {
  constructor(private readonly jwtService: JwtService) {}

  async generateToken(payload: TokenPayload): Promise<string> {
    return this.jwtService.signAsync(
      {
        sub: payload.userId,
        email: payload.email,
        role: payload.role,
        type: 'access',
      },
      {
        expiresIn: '15m',
      },
    );
  }

  async generateTokens(payload: TokenPayload): Promise<AuthTokens> {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(
        {
          sub: payload.userId,
          email: payload.email,
          role: payload.role,
          type: 'access',
        },
        {
          expiresIn: '15m',
        },
      ),
      this.jwtService.signAsync(
        {
          sub: payload.userId,
          email: payload.email,
          role: payload.role,
          type: 'refresh',
        },
        {
          expiresIn: '7d',
        },
      ),
    ]);

    return {
      accessToken,
      refreshToken,
    };
  }

  async verifyToken<T extends object = any>(token: string): Promise<T> {
    return this.jwtService.verifyAsync<T>(token);
  }

  async verifyRefreshToken<T extends object = any>(token: string): Promise<T> {
    const payload = await this.jwtService.verifyAsync<any>(token);
    if (payload && payload.type && payload.type !== 'refresh') {
      throw new Error('Token không phải là refresh token hợp lệ');
    }
    return payload as T;
  }
}
