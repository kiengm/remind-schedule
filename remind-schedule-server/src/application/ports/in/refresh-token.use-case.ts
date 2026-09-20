export interface RefreshTokenCommand {
  refreshToken: string;
}

export interface TokensResult {
  accessToken: string;
  refreshToken: string;
}

export interface IRefreshTokenUseCase {
  execute(command: RefreshTokenCommand): Promise<TokensResult>;
}

