export interface TokenPayload {
  userId: string;
  email: string;
  role: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface ITokenServicePort {
  generateToken(payload: TokenPayload): Promise<string>;
  generateTokens(payload: TokenPayload): Promise<AuthTokens>;
  verifyToken<T extends object = any>(token: string): Promise<T>;
  verifyRefreshToken<T extends object = any>(token: string): Promise<T>;
}

