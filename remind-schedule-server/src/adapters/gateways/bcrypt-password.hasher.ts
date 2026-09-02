import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { IPasswordHasherPort } from '../../application/ports/out/password-hasher.port';

@Injectable()
export class BcryptPasswordHasher implements IPasswordHasherPort {
  private readonly saltRounds = 10;

  async hash(plainText: string): Promise<string> {
    const salt = await bcrypt.genSalt(this.saltRounds);
    return await bcrypt.hash(plainText, salt);
  }

  async compare(plainText: string, hashed: string): Promise<boolean> {
    return await bcrypt.compare(plainText, hashed);
  }
}

