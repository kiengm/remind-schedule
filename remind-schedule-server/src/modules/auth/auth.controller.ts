import { Body, Controller, Get, HttpCode, HttpStatus, Post, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { AuthResponseViewModel, TokensViewModel, UserViewModel } from './entities/user.entity';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { ENDPOINTS } from '../../common/constants/api.constants';

@ApiTags('Authentication')
@Controller(ENDPOINTS.AUTH.ROOT)
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post(ENDPOINTS.AUTH.REGISTER)
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Đăng ký tài khoản mới' })
  @ApiResponse({
    status: 201,
    description: 'Đăng ký thành công, trả về user, accessToken và refreshToken',
  })
  @ApiResponse({
    status: 400,
    description: 'Dữ liệu không hợp lệ hoặc email/số điện thoại đã tồn tại',
  })
  async register(@Body() dto: RegisterDto): Promise<AuthResponseViewModel> {
    return this.authService.register(dto);
  }

  @Post(ENDPOINTS.AUTH.LOGIN)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Đăng nhập vào hệ thống' })
  @ApiResponse({
    status: 200,
    description: 'Đăng nhập thành công, trả về user, accessToken và refreshToken',
  })
  @ApiResponse({ status: 400, description: 'Sai email hoặc mật khẩu' })
  async login(@Body() dto: LoginDto): Promise<AuthResponseViewModel> {
    return this.authService.login(dto);
  }

  @Post(ENDPOINTS.AUTH.REFRESH_TOKEN)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Làm mới Access Token bằng Refresh Token' })
  @ApiResponse({ status: 200, description: 'Cấp cặp token mới thành công' })
  @ApiResponse({ status: 401, description: 'Refresh token không hợp lệ hoặc đã bị thu hồi' })
  async refreshToken(@Body() dto: RefreshTokenDto): Promise<TokensViewModel> {
    return this.authService.refreshToken(dto.refreshToken);
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
    await this.authService.logout(userId);
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
    const userId = payload?.userId || payload?.sub;
    return this.authService.getProfile(userId);
  }
}
