import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsDateString, IsEnum, IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';
import { ReminderPriority } from '../../../core/domain/enums/reminder-priority.enum';

export class CreateReminderDto {
  @ApiProperty({ description: 'Tiêu đề lịch nhắc', example: 'Họp ban quản trị' })
  @IsString()
  @IsNotEmpty({ message: 'Tiêu đề không được để trống' })
  @MaxLength(255)
  title: string;

  @ApiPropertyOptional({ description: 'Mô tả chi tiết', example: 'Thảo luận báo cáo tài chính quý 3' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ description: 'Thời gian nhắc nhở (ISO 8601)', example: '2026-09-03T10:00:00.000Z' })
  @IsDateString({}, { message: 'scheduledAt phải là định dạng ISO 8601 Date hợp lệ' })
  scheduledAt: string;

  @ApiPropertyOptional({ enum: ReminderPriority, default: ReminderPriority.MEDIUM, description: 'Mức độ ưu tiên' })
  @IsOptional()
  @IsEnum(ReminderPriority, { message: 'Mức độ ưu tiên không hợp lệ' })
  priority?: ReminderPriority;
}

