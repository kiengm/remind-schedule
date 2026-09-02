export interface TokenPayload {
  userId: string;
  email: string;
  role: string;
}

export interface ITokenServicePort {
  generateToken(payload: TokenPayload): Promise<string>;
  verifyToken<T extends object = any>(token: string): Promise<T>;
}

