import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Inject,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import {
  CREATE_REMINDER_USE_CASE,
  DELETE_REMINDER_USE_CASE,
  GET_REMINDERS_USE_CASE,
  UPDATE_REMINDER_USE_CASE,
} from '../../modules/reminder.tokens';
import { ICreateReminderUseCase } from '../../application/ports/in/create-reminder.use-case';
import { IGetRemindersUseCase } from '../../application/ports/in/get-reminders.use-case';
import { IUpdateReminderUseCase } from '../../application/ports/in/update-reminder.use-case';
import { IDeleteReminderUseCase } from '../../application/ports/in/delete-reminder.use-case';
import { CreateReminderDto } from './dtos/create-reminder.dto';
import { UpdateReminderDto } from './dtos/update-reminder.dto';
import { ReminderPresenter, ReminderViewModel } from '../presenters/reminder.presenter';
import { ENDPOINTS } from '../../infrastructure/common/constants/api.constants';

@ApiTags('Reminders')
@Controller(ENDPOINTS.REMINDERS.ROOT)
export class ReminderController {
  constructor(
    @Inject(CREATE_REMINDER_USE_CASE)
    private readonly createReminderUseCase: ICreateReminderUseCase,
    @Inject(GET_REMINDERS_USE_CASE)
    private readonly getRemindersUseCase: IGetRemindersUseCase,
    @Inject(UPDATE_REMINDER_USE_CASE)
    private readonly updateReminderUseCase: IUpdateReminderUseCase,
    @Inject(DELETE_REMINDER_USE_CASE)
    private readonly deleteReminderUseCase: IDeleteReminderUseCase
  ) {}

  @Post(ENDPOINTS.REMINDERS.CREATE)
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Tạo mới một lịch nhắc' })
  @ApiResponse({ status: 201, description: 'Lịch nhắc đã được tạo thành công' })
  async create(@Body() dto: CreateReminderDto): Promise<ReminderViewModel> {
    const entity = await this.createReminderUseCase.execute({
      title: dto.title,
      description: dto.description,
      scheduledAt: new Date(dto.scheduledAt),
      priority: dto.priority,
    });
    return ReminderPresenter.toViewModel(entity);
  }

  @Get(ENDPOINTS.REMINDERS.LIST)
  @ApiOperation({ summary: 'Lấy danh sách tất cả các lịch nhắc' })
  @ApiResponse({ status: 200, description: 'Danh sách lịch nhắc sắp xếp theo thời gian' })
  async findAll(): Promise<ReminderViewModel[]> {
    const entities = await this.getRemindersUseCase.findAll();
    return ReminderPresenter.toViewModelList(entities);
  }

  @Get(ENDPOINTS.REMINDERS.BY_ID)
  @ApiOperation({ summary: 'Lấy chi tiết một lịch nhắc theo ID' })
  @ApiParam({ name: 'id', description: 'ID của lịch nhắc' })
  @ApiResponse({ status: 200, description: 'Thông tin chi tiết lịch nhắc' })
  @ApiResponse({ status: 404, description: 'Không tìm thấy lịch nhắc' })
  async findOne(@Param('id') id: string): Promise<ReminderViewModel> {
    const entity = await this.getRemindersUseCase.findById(id);
    return ReminderPresenter.toViewModel(entity);
  }

  @Patch(ENDPOINTS.REMINDERS.UPDATE)
  @ApiOperation({ summary: 'Cập nhật thông tin lịch nhắc' })
  @ApiParam({ name: 'id', description: 'ID của lịch nhắc' })
  @ApiResponse({ status: 200, description: 'Cập nhật thành công' })
  @ApiResponse({ status: 404, description: 'Không tìm thấy lịch nhắc' })
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateReminderDto
  ): Promise<ReminderViewModel> {
    const entity = await this.updateReminderUseCase.execute({
      id,
      title: dto.title,
      description: dto.description,
      scheduledAt: dto.scheduledAt ? new Date(dto.scheduledAt) : undefined,
      priority: dto.priority,
      status: dto.status,
    });
    return ReminderPresenter.toViewModel(entity);
  }

  @Delete(ENDPOINTS.REMINDERS.DELETE)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Xóa một lịch nhắc' })
  @ApiParam({ name: 'id', description: 'ID của lịch nhắc' })
  @ApiResponse({ status: 204, description: 'Đã xóa thành công' })
  @ApiResponse({ status: 404, description: 'Không tìm thấy lịch nhắc' })
  async delete(@Param('id') id: string): Promise<void> {
    await this.deleteReminderUseCase.execute(id);
  }
}

