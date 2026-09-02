import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ITokenServicePort, TokenPayload } from '../../application/ports/out/token-service.port';

@Injectable()
export class JwtTokenService implements ITokenServicePort {
  constructor(private readonly jwtService: JwtService) {}

  async generateToken(payload: TokenPayload): Promise<string> {
    return this.jwtService.signAsync({
      sub: payload.userId,
      email: payload.email,
      role: payload.role,
    });
  }

  async verifyToken<T extends object = any>(token: string): Promise<T> {
    return this.jwtService.verifyAsync<T>(token);
  }
}

