import { UserEntity } from '../../core/domain/entities/user.entity';
import { AuthResult, IRegisterUseCase, RegisterCommand } from '../ports/in/register.use-case';
import { IUserRepositoryPort } from '../ports/out/user-repository.port';
import { IPasswordHasherPort } from '../ports/out/password-hasher.port';
import { ITokenServicePort } from '../ports/out/token-service.port';

export class RegisterInteractor implements IRegisterUseCase {
  constructor(
    private readonly userRepository: IUserRepositoryPort,
    private readonly passwordHasher: IPasswordHasherPort,
    private readonly tokenService: ITokenServicePort
  ) {}

  async execute(command: RegisterCommand): Promise<AuthResult> {
    // 1. Kiểm tra email đã tồn tại chưa
    const existingEmail = await this.userRepository.findByEmail(command.email);
    if (existingEmail) {
      throw new Error(`Email "${command.email}" đã được sử dụng. Vui lòng chọn email khác`);
    }

    // 2. Kiểm tra số điện thoại (nếu có)
    if (command.phone) {
      const existingPhone = await this.userRepository.findByPhone(command.phone);
      if (existingPhone) {
        throw new Error(`Số điện thoại "${command.phone}" đã được sử dụng`);
      }
    }

    // 3. Hash mật khẩu
    const hashedPassword = await this.passwordHasher.hash(command.password);

    // 4. Tạo User Domain Entity
    const user = new UserEntity({
      name: command.name,
      email: command.email,
      password: hashedPassword,
      phone: command.phone || null,
    });

    // 5. Lưu vào Database thông qua Output Port
    const savedUser = await this.userRepository.save(user);

    // 6. Tạo JWT Token
    const accessToken = await this.tokenService.generateToken({
      userId: savedUser.id,
      email: savedUser.email,
      role: savedUser.role,
    });

    return {
      user: savedUser,
      accessToken,
    };
  }
}

