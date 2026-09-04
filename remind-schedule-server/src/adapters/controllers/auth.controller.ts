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
  REGISTER_USE_CASE,
  USER_REPOSITORY,
} from '../../modules/auth.tokens';
import { IRegisterUseCase } from '../../application/ports/in/register.use-case';
import { ILoginUseCase } from '../../application/ports/in/login.use-case';
import { IUserRepositoryPort } from '../../application/ports/out/user-repository.port';
import { RegisterDto } from './dtos/register.dto';
import { LoginDto } from './dtos/login.dto';
import { AuthPresenter, AuthResponseViewModel, UserViewModel } from '../presenters/auth.presenter';
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
    @Inject(USER_REPOSITORY)
    private readonly userRepository: IUserRepositoryPort
  ) {}

  @Post(ENDPOINTS.AUTH.REGISTER)
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Đăng ký tài khoản mới' })
  @ApiResponse({ status: 201, description: 'Đăng ký thành công, trả về thông tin user và accessToken' })
  @ApiResponse({ status: 400, description: 'Dữ liệu không hợp lệ hoặc email/số điện thoại đã tồn tại' })
  async register(@Body() dto: RegisterDto): Promise<AuthResponseViewModel> {
    const result = await this.registerUseCase.execute({
      name: dto.name,
      email: dto.email,
      password: dto.password,
      phone: dto.phone,
    });
    return AuthPresenter.toAuthResponse(result.user, result.accessToken);
  }

  @Post(ENDPOINTS.AUTH.LOGIN)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Đăng nhập vào hệ thống' })
  @ApiResponse({ status: 200, description: 'Đăng nhập thành công, trả về accessToken' })
  @ApiResponse({ status: 400, description: 'Sai email hoặc mật khẩu' })
  async login(@Body() dto: LoginDto): Promise<AuthResponseViewModel> {
    const result = await this.loginUseCase.execute({
      email: dto.email,
      password: dto.password,
    });
    return AuthPresenter.toAuthResponse(result.user, result.accessToken);
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

