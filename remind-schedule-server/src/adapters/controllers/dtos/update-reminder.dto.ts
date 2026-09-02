import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsDateString, IsEnum, IsOptional, IsString, MaxLength } from 'class-validator';
import { ReminderPriority } from '../../../core/domain/enums/reminder-priority.enum';
import { ReminderStatus } from '../../../core/domain/enums/reminder-status.enum';

export class UpdateReminderDto {
  @ApiPropertyOptional({ description: 'Tiêu đề lịch nhắc', example: 'Họp ban quản trị (dời lịch)' })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  title?: string;

  @ApiPropertyOptional({ description: 'Mô tả chi tiết', example: 'Cập nhật nội dung thảo luận mới' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ description: 'Thời gian nhắc nhở mới (ISO 8601)', example: '2026-09-04T14:30:00.000Z' })
  @IsOptional()
  @IsDateString({}, { message: 'scheduledAt phải là định dạng ISO 8601 Date hợp lệ' })
  scheduledAt?: string;

  @ApiPropertyOptional({ enum: ReminderPriority, description: 'Mức độ ưu tiên' })
  @IsOptional()
  @IsEnum(ReminderPriority)
  priority?: ReminderPriority;

  @ApiPropertyOptional({ enum: ReminderStatus, description: 'Trạng thái lịch nhắc' })
  @IsOptional()
  @IsEnum(ReminderStatus)
  status?: ReminderStatus;
}

