import { ILogoutUseCase, LogoutCommand } from '../ports/in/logout.use-case';
import { IUserRepositoryPort } from '../ports/out/user-repository.port';

export class LogoutInteractor implements ILogoutUseCase {
  constructor(private readonly userRepository: IUserRepositoryPort) {}

  async execute(command: LogoutCommand): Promise<void> {
    if (!command.userId) {
      return;
    }
    // Thu hồi Refresh Token trong DB bằng cách đặt về null
    await this.userRepository.updateRefreshToken(command.userId, null);
  }
}
