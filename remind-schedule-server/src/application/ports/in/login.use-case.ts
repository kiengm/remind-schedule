import { AuthResult } from './register.use-case';
export { AuthResult };

export interface LoginCommand {
  email: string;
  password: string;
}

export interface ILoginUseCase {
  execute(command: LoginCommand): Promise<AuthResult>;
}
