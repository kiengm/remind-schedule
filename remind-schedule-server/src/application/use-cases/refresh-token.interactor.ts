import {
  IRefreshTokenUseCase,
  RefreshTokenCommand,
  TokensResult,
} from '../ports/in/refresh-token.use-case';
import { IUserRepositoryPort } from '../ports/out/user-repository.port';
import { IPasswordHasherPort } from '../ports/out/password-hasher.port';
import { ITokenServicePort } from '../ports/out/token-service.port';

export class RefreshTokenInteractor implements IRefreshTokenUseCase {
  constructor(
    private readonly userRepository: IUserRepositoryPort,
    private readonly passwordHasher: IPasswordHasherPort,
    private readonly tokenService: ITokenServicePort,
  ) {}

  async execute(command: RefreshTokenCommand): Promise<TokensResult> {
    if (!command.refreshToken) {
      throw new Error('auth.refreshTokenRequired');
    }

    // 1. Verify chữ ký và hạn của Refresh Token
    let payload: { sub: string; email: string; role: string };
    try {
      payload = await this.tokenService.verifyRefreshToken(command.refreshToken);
    } catch {
      throw new Error('auth.refreshTokenInvalid');
    }

    // 2. Tìm người dùng trong cơ sở dữ liệu
    const user = await this.userRepository.findById(payload.sub);
    if (!user) {
      throw new Error('auth.userNotFound');
    }

    if (!user.isActive) {
      throw new Error('auth.userDisabled');
    }

    // 3. Kiểm tra xem Refresh Token có bị thu hồi không (khi logout hoặc replay attack)
    if (!user.refreshTokenHash) {
      throw new Error('auth.refreshTokenRevoked');
    }

    // 4. So khớp hash trong DB với refresh token gửi lên
    const isMatch = await this.passwordHasher.compare(command.refreshToken, user.refreshTokenHash);

    if (!isMatch) {
      // Nếu không khớp hash, có thể phiên này đã bị xâm phạm
      throw new Error('auth.refreshTokenInvalid');
    }

    // 5. Cơ chế Refresh Token Rotation: Sinh cặp token hoàn toàn mới
    const { accessToken, refreshToken: newRefreshToken } = await this.tokenService.generateTokens({
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    // 6. Hash Refresh Token mới và cập nhật lại vào Database
    const newHashed = await this.passwordHasher.hash(newRefreshToken);
    await this.userRepository.updateRefreshToken(user.id, newHashed);
    user.updateRefreshTokenHash(newHashed);

    return {
      accessToken,
      refreshToken: newRefreshToken,
    };
  }
}
