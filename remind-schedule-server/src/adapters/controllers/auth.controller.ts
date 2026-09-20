import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Inject,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import {
  LOGIN_USE_CASE,
  LOGOUT_USE_CASE,
  REFRESH_TOKEN_USE_CASE,
  REGISTER_USE_CASE,
  USER_REPOSITORY,
} from '../../modules/auth.tokens';
import { IRegisterUseCase } from '../../application/ports/in/register.use-case';
import { ILoginUseCase } from '../../application/ports/in/login.use-case';
import { IRefreshTokenUseCase } from '../../application/ports/in/refresh-token.use-case';
import { ILogoutUseCase } from '../../application/ports/in/logout.use-case';
import { IUserRepositoryPort } from '../../application/ports/out/user-repository.port';
import { RegisterDto } from './dtos/register.dto';
import { LoginDto } from './dtos/login.dto';
import { RefreshTokenDto } from './dtos/refresh-token.dto';
import {
  AuthPresenter,
  AuthResponseViewModel,
  TokensViewModel,
  UserViewModel,
} from '../presenters/auth.presenter';
import { JwtAuthGuard } from '../../infrastructure/common/guards/jwt-auth.guard';
import { ENDPOINTS } from '../../infrastructure/common/constants/api.constants';

@ApiTags('Authentication')
@Controller(ENDPOINTS.AUTH.ROOT)
export class AuthController {
  constructor(
    @Inject(REGISTER_USE_CASE)
    private readonly registerUseCase: IRegisterUseCase,
    @Inject(LOGIN_USE_CASE)
    private readonly loginUseCase: ILoginUseCase,
    @Inject(REFRESH_TOKEN_USE_CASE)
    private readonly refreshTokenUseCase: IRefreshTokenUseCase,
    @Inject(LOGOUT_USE_CASE)
    private readonly logoutUseCase: ILogoutUseCase,
    @Inject(USER_REPOSITORY)
    private readonly userRepository: IUserRepositoryPort
  ) {}

  @Post(ENDPOINTS.AUTH.REGISTER)
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Đăng ký tài khoản mới' })
  @ApiResponse({ status: 201, description: 'Đăng ký thành công, trả về thông tin user và accessToken' })
  @ApiResponse({ status: 201, description: 'Đăng ký thành công, trả về user, accessToken và refreshToken' })
  @ApiResponse({ status: 400, description: 'Dữ liệu không hợp lệ hoặc email/số điện thoại đã tồn tại' })
  async register(@Body() dto: RegisterDto): Promise<AuthResponseViewModel> {
    const result = await this.registerUseCase.execute({
      name: dto.name,
      email: dto.email,
      password: dto.password,
      phone: dto.phone,
    });
    return AuthPresenter.toAuthResponse(result.user, result.accessToken, result.refreshToken);
  }

  @Post(ENDPOINTS.AUTH.LOGIN)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Đăng nhập vào hệ thống' })
  @ApiResponse({ status: 200, description: 'Đăng nhập thành công, trả về accessToken' })
  @ApiResponse({ status: 200, description: 'Đăng nhập thành công, trả về accessToken và refreshToken' })
  @ApiResponse({ status: 400, description: 'Sai email hoặc mật khẩu' })
  async login(@Body() dto: LoginDto): Promise<AuthResponseViewModel> {
    const result = await this.loginUseCase.execute({
      email: dto.email,
      password: dto.password,
    });
    return AuthPresenter.toAuthResponse(result.user, result.accessToken, result.refreshToken);
  }

  @Post(ENDPOINTS.AUTH.REFRESH_TOKEN)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Làm mới Access Token bằng Refresh Token' })
  @ApiResponse({ status: 200, description: 'Cấp cặp token mới thành công' })
  @ApiResponse({ status: 401, description: 'Refresh token không hợp lệ hoặc đã bị thu hồi' })
  async refreshToken(@Body() dto: RefreshTokenDto): Promise<TokensViewModel> {
    const result = await this.refreshTokenUseCase.execute({
      refreshToken: dto.refreshToken,
    });
    return AuthPresenter.toTokensViewModel(result.accessToken, result.refreshToken);
  }

  @Post(ENDPOINTS.AUTH.LOGOUT)
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Đăng xuất tài khoản và thu hồi Refresh Token' })
  @ApiResponse({ status: 200, description: 'Đăng xuất thành công' })
  @ApiResponse({ status: 401, description: 'Chưa đăng nhập hoặc token không hợp lệ' })
  async logout(@Req() req: Request): Promise<{ success: boolean; message: string }> {
    const payload = (req as any).user;
    const userId = payload?.userId || payload?.sub;
    await this.logoutUseCase.execute({ userId });
    return { success: true, message: 'auth.logoutSuccess' };
  }

  @Get(ENDPOINTS.AUTH.ME)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Lấy thông tin tài khoản hiện tại từ Token' })
  @ApiResponse({ status: 200, description: 'Thông tin tài khoản' })
  @ApiResponse({ status: 401, description: 'Chưa đăng nhập hoặc token không hợp lệ' })
  async getProfile(@Req() req: Request): Promise<UserViewModel> {
    const payload = (req as any).user;
    const user = await this.userRepository.findById(payload.userId || payload.sub);
    if (!user) {
      throw new Error('auth.userNotFound');
    }
    return AuthPresenter.toUserViewModel(user);


  }
}

