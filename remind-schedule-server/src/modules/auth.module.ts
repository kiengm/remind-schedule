import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from '../adapters/controllers/auth.controller';
import { PrismaUserRepository } from '../adapters/gateways/prisma-user.repository';
import { BcryptPasswordHasher } from '../adapters/gateways/bcrypt-password.hasher';
import { JwtTokenService } from '../adapters/gateways/jwt-token.service';
import { RegisterInteractor } from '../application/use-cases/register.interactor';
import { LoginInteractor } from '../application/use-cases/login.interactor';
import { IUserRepositoryPort } from '../application/ports/out/user-repository.port';
import { IPasswordHasherPort } from '../application/ports/out/password-hasher.port';
import { ITokenServicePort } from '../application/ports/out/token-service.port';
import { JwtAuthGuard } from '../infrastructure/common/guards/jwt-auth.guard';
import { PrismaModule } from '../infrastructure/database/prisma/prisma.module';
import {
  LOGIN_USE_CASE,
  PASSWORD_HASHER,
  REGISTER_USE_CASE,
  TOKEN_SERVICE,
  USER_REPOSITORY,
} from './auth.tokens';

@Module({
  imports: [
    PrismaModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'remind_schedule_super_secret_jwt_key_2026',
      signOptions: { expiresIn: '7d' },
    }),
  ],
  controllers: [AuthController],
  providers: [
    // Gateways
    {
      provide: USER_REPOSITORY,
      useClass: PrismaUserRepository,
    },
    {
      provide: PASSWORD_HASHER,
      useClass: BcryptPasswordHasher,
    },
    {
      provide: TOKEN_SERVICE,
      useClass: JwtTokenService,
    },

    // Interactors / Use Cases
    {
      provide: REGISTER_USE_CASE,
      useFactory: (
        userRepo: IUserRepositoryPort,
        hasher: IPasswordHasherPort,
        tokenService: ITokenServicePort
      ) => new RegisterInteractor(userRepo, hasher, tokenService),
      inject: [USER_REPOSITORY, PASSWORD_HASHER, TOKEN_SERVICE],
    },
    {
      provide: LOGIN_USE_CASE,
      useFactory: (
        userRepo: IUserRepositoryPort,
        hasher: IPasswordHasherPort,
        tokenService: ITokenServicePort
      ) => new LoginInteractor(userRepo, hasher, tokenService),
      inject: [USER_REPOSITORY, PASSWORD_HASHER, TOKEN_SERVICE],
    },

    // Guard
    JwtAuthGuard,
  ],
  exports: [
    USER_REPOSITORY,
    PASSWORD_HASHER,
    TOKEN_SERVICE,
    REGISTER_USE_CASE,
    LOGIN_USE_CASE,
    JwtAuthGuard,
  ],
})
export class AuthModule {}

