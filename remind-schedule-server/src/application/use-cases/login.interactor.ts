import { AuthResult, ILoginUseCase, LoginCommand } from '../ports/in/login.use-case';
import { IUserRepositoryPort } from '../ports/out/user-repository.port';
import { IPasswordHasherPort } from '../ports/out/password-hasher.port';
import { ITokenServicePort } from '../ports/out/token-service.port';

export class LoginInteractor implements ILoginUseCase {
  constructor(
    private readonly userRepository: IUserRepositoryPort,
    private readonly passwordHasher: IPasswordHasherPort,
    private readonly tokenService: ITokenServicePort,
  ) {}

  async execute(command: LoginCommand): Promise<AuthResult> {
    // 1. Tìm tài khoản theo email
    const user = await this.userRepository.findByEmail(command.email);
    if (!user) {
      throw new Error('auth.emailPasswordInvalid');
    }

    // 2. Kiểm tra trạng thái kích hoạt tài khoản
    if (!user.isActive) {
      throw new Error('auth.userDisabled');
    }

    // 3. So khớp mật khẩu
    const isPasswordValid = await this.passwordHasher.compare(command.password, user.password);
    if (!isPasswordValid) {
      throw new Error('auth.emailPasswordInvalid');
    }

    // 4. Sinh cặp JWT Tokens (Access Token 15m, Refresh Token 7d)
    const { accessToken, refreshToken } = await this.tokenService.generateTokens({
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    // 5. Hash Refresh Token và cập nhật vào Database
    const hashedRefreshToken = await this.passwordHasher.hash(refreshToken);
    await this.userRepository.updateRefreshToken(user.id, hashedRefreshToken);
    user.updateRefreshTokenHash(hashedRefreshToken);

    return {
      user,
      accessToken,
      refreshToken,
    };
  }
}
