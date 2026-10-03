import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Res,
} from '@nestjs/common';
import { Response } from 'express';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ReminderService } from './reminder.service';
import { CreateReminderDto } from './dto/create-reminder.dto';
import { UpdateReminderDto } from './dto/update-reminder.dto';
import { ReminderViewModel } from './entities/reminder.entity';
import { ENDPOINTS } from '../../common/constants/api.constants';

@ApiTags('Reminders')
@Controller(ENDPOINTS.REMINDERS.ROOT)
export class ReminderController {
  constructor(private readonly reminderService: ReminderService) {}

  @Get(ENDPOINTS.REMINDERS.TEMPLATE)
  @ApiOperation({ summary: 'Tải file Excel mẫu để import lịch nhắc' })
  @ApiResponse({ status: 200, description: 'File Excel mẫu (.xlsx)' })
  async downloadTemplate(@Res() res: Response): Promise<void> {
    const buffer = await this.reminderService.generateTemplate();
    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    );
    res.setHeader('Content-Disposition', 'attachment; filename="reminder_template.xlsx"');
    res.send(buffer);
  }

  @Post(ENDPOINTS.REMINDERS.CREATE)
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Tạo mới một lịch nhắc' })
  @ApiResponse({ status: 201, description: 'Lịch nhắc đã được tạo thành công' })
  async create(@Body() dto: CreateReminderDto): Promise<ReminderViewModel> {
    return this.reminderService.create(dto);
  }

  @Get(ENDPOINTS.REMINDERS.LIST)
  @ApiOperation({ summary: 'Lấy danh sách tất cả các lịch nhắc' })
  @ApiResponse({ status: 200, description: 'Danh sách lịch nhắc sắp xếp theo thời gian' })
  async findAll(): Promise<ReminderViewModel[]> {
    return this.reminderService.findAll();
  }

  @Get(ENDPOINTS.REMINDERS.BY_ID)
  @ApiOperation({ summary: 'Lấy chi tiết một lịch nhắc theo ID' })
  @ApiParam({ name: 'id', description: 'ID của lịch nhắc' })
  @ApiResponse({ status: 200, description: 'Thông tin chi tiết lịch nhắc' })
  @ApiResponse({ status: 404, description: 'Không tìm thấy lịch nhắc' })
  async findOne(@Param('id') id: string): Promise<ReminderViewModel> {
    return this.reminderService.findById(id);
  }

  @Patch(ENDPOINTS.REMINDERS.UPDATE)
  @ApiOperation({ summary: 'Cập nhật thông tin lịch nhắc' })
  @ApiParam({ name: 'id', description: 'ID của lịch nhắc' })
  @ApiResponse({ status: 200, description: 'Cập nhật thành công' })
  @ApiResponse({ status: 404, description: 'Không tìm thấy lịch nhắc' })
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateReminderDto,
  ): Promise<ReminderViewModel> {
    return this.reminderService.update(id, dto);
  }

  @Delete(ENDPOINTS.REMINDERS.DELETE)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Xóa một lịch nhắc' })
  @ApiParam({ name: 'id', description: 'ID của lịch nhắc' })
  @ApiResponse({ status: 204, description: 'Đã xóa thành công' })
  @ApiResponse({ status: 404, description: 'Không tìm thấy lịch nhắc' })
  async delete(@Param('id') id: string): Promise<void> {
    await this.reminderService.delete(id);
  }
}
