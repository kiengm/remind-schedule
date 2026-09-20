export interface LogoutCommand {
  userId: string;
}

export interface ILogoutUseCase {
  execute(command: LogoutCommand): Promise<void>;
}

