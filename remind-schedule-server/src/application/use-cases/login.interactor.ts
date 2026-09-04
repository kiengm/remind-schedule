import { AuthResult, ILoginUseCase, LoginCommand } from '../ports/in/login.use-case';
import { IUserRepositoryPort } from '../ports/out/user-repository.port';
import { IPasswordHasherPort } from '../ports/out/password-hasher.port';
import { ITokenServicePort } from '../ports/out/token-service.port';

export class LoginInteractor implements ILoginUseCase {
  constructor(
    private readonly userRepository: IUserRepositoryPort,
    private readonly passwordHasher: IPasswordHasherPort,
    private readonly tokenService: ITokenServicePort
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



    // 4. Sinh JWT Access Token
    const accessToken = await this.tokenService.generateToken({
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    return {
      user,
      accessToken,
    };
  }
}

