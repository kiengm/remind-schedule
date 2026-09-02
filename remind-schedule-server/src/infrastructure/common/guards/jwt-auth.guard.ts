import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { TOKEN_SERVICE } from '../../../modules/auth.tokens';
import { ITokenServicePort } from '../../../application/ports/out/token-service.port';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    @Inject(TOKEN_SERVICE)
    private readonly tokenService: ITokenServicePort
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const authHeader = request.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException('Không tìm thấy Bearer token xác thực');
    }

    const token = authHeader.split(' ')[1];
    try {
      const payload = await this.tokenService.verifyToken(token);
      (request as any).user = payload;
      return true;
    } catch {
      throw new UnauthorizedException('Token xác thực không hợp lệ hoặc đã hết hạn');
    }
  }
}

