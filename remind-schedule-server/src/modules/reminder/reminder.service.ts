import { Injectable, NotFoundException } from '@nestjs/common';
import * as ExcelJS from 'exceljs';
import { v4 as uuidv4 } from 'uuid';
import { CreateReminderDto } from './dto/create-reminder.dto';
import { UpdateReminderDto } from './dto/update-reminder.dto';
import { ReminderEntity, ReminderViewModel } from './entities/reminder.entity';

@Injectable()
export class ReminderService {
  private readonly items: Map<string, ReminderEntity> = new Map();

  constructor() {
    // Khởi tạo một số dữ liệu mẫu cho bảng Reminders
    const sample = new ReminderEntity({
      id: uuidv4(),
      title: 'Họp kế hoạch tuần mới',
      description: 'Review tiến độ các dự án và phân công task tuần này.',
      scheduledAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    this.items.set(sample.id, sample);
  }

  // --- 1. CÁC PHƯƠNG THỨC CRUD ---

  async create(dto: CreateReminderDto): Promise<ReminderViewModel> {
    const id = uuidv4();
    const entity = new ReminderEntity({
      id,
      title: dto.title,
      description: dto.description,
      scheduledAt: new Date(dto.scheduledAt),
      priority: dto.priority,
    });

    this.items.set(id, entity);
    return entity.toViewModel();
  }

  async findAll(): Promise<ReminderViewModel[]> {
    const list = Array.from(this.items.values()).sort(
      (a, b) => a.scheduledAt.getTime() - b.scheduledAt.getTime(),
    );
    return list.map((item) => item.toViewModel());
  }

  async findById(id: string): Promise<ReminderViewModel> {
    const entity = this.items.get(id);
    if (!entity) {
      throw new NotFoundException('reminders.notFound');
    }
    return entity.toViewModel();
  }

  async update(id: string, dto: UpdateReminderDto): Promise<ReminderViewModel> {
    const entity = this.items.get(id);
    if (!entity) {
      throw new NotFoundException('reminders.notFound');
    }

    entity.updateDetails(
      dto.title,
      dto.description,
      dto.scheduledAt ? new Date(dto.scheduledAt) : undefined,
      dto.priority,
      dto.status,
    );

    this.items.set(id, entity);
    return entity.toViewModel();
  }

  async delete(id: string): Promise<void> {
    const exists = this.items.has(id);
    if (!exists) {
      throw new NotFoundException('reminders.notFound');
    }
    this.items.delete(id);
  }

  // --- 2. CHỨC NĂNG EXCEL: TẠO FILE EXCEL MẪU (TEMPLATE) ---

  async generateTemplate(): Promise<Buffer> {
    const workbook = new ExcelJS.Workbook();
    workbook.creator = 'Remind Schedule';
    workbook.created = new Date();

    // Sheet 1: Danh sách lịch nhắc
    const sheet = workbook.addWorksheet('Danh sách lịch nhắc', {
      views: [{ showGridLines: true }],
    });

    sheet.columns = [
      { header: 'Tiêu đề (*)', key: 'title', width: 32 },
      { header: 'Mô tả', key: 'description', width: 45 },
      { header: 'Thời gian nhắc nhở (*)', key: 'scheduledAt', width: 25 },
      { header: 'Mức độ ưu tiên', key: 'priority', width: 20 },
      { header: 'Trạng thái', key: 'status', width: 18 },
    ];

    // Định dạng Header Row
    const headerRow = sheet.getRow(1);
    headerRow.height = 30;
    headerRow.eachCell((cell) => {
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FF2563EB' }, // Primary Blue #2563EB
      };
      cell.font = {
        name: 'Segoe UI',
        size: 11,
        bold: true,
        color: { argb: 'FFFFFFFF' },
      };
      cell.alignment = {
        vertical: 'middle',
        horizontal: 'center',
        wrapText: true,
      };
      cell.border = {
        top: { style: 'thin', color: { argb: 'FFCBD5E1' } },
        left: { style: 'thin', color: { argb: 'FFCBD5E1' } },
        bottom: { style: 'medium', color: { argb: 'FF1D4ED8' } },
        right: { style: 'thin', color: { argb: 'FFCBD5E1' } },
      };
    });

    // Dòng dữ liệu mẫu trực quan
    const sampleRows = [
      {
        title: 'Họp triển khai dự án',
        description: 'Thảo luận tiến độ và phân chia công việc cho tuần mới',
        scheduledAt: '2026-10-05 09:00',
        priority: 'HIGH',
        status: 'PENDING',
      },
      {
        title: 'Nộp báo cáo tài chính tuần',
        description: 'Tổng hợp số liệu doanh thu và chi phí gửi ban giám đốc',
        scheduledAt: '2026-10-06 17:30',
        priority: 'URGENT',
        status: 'PENDING',
      },
      {
        title: 'Kiểm tra sức khỏe định kỳ',
        description: 'Khám tổng quát tại phòng khám theo lịch công ty',
        scheduledAt: '2026-10-10 08:30',
        priority: 'LOW',
        status: 'PENDING',
      },
    ];

    sampleRows.forEach((item) => {
      const row = sheet.addRow(item);
      row.height = 24;
      row.eachCell((cell, colNumber) => {
        cell.font = { name: 'Segoe UI', size: 10 };
        cell.border = {
          top: { style: 'thin', color: { argb: 'FFE2E8F0' } },
          left: { style: 'thin', color: { argb: 'FFE2E8F0' } },
          bottom: { style: 'thin', color: { argb: 'FFE2E8F0' } },
          right: { style: 'thin', color: { argb: 'FFE2E8F0' } },
        };
        if (colNumber === 1 || colNumber === 2) {
          cell.alignment = { vertical: 'middle', horizontal: 'left' };
        } else {
          cell.alignment = { vertical: 'middle', horizontal: 'center' };
        }
      });
    });

    // Data Validation (Dropdown) cho các dòng 2-500
    for (let r = 2; r <= 500; r++) {
      const row = sheet.getRow(r);
      row.getCell(4).dataValidation = {
        type: 'list',
        allowBlank: true,
        formulae: ['"LOW,MEDIUM,HIGH,URGENT"'],
        showErrorMessage: true,
        errorTitle: 'Giá trị không hợp lệ',
        error: 'Vui lòng chọn: LOW, MEDIUM, HIGH, hoặc URGENT',
      };

      row.getCell(5).dataValidation = {
        type: 'list',
        allowBlank: true,
        formulae: ['"PENDING,COMPLETED,CANCELLED"'],
        showErrorMessage: true,
        errorTitle: 'Giá trị không hợp lệ',
        error: 'Vui lòng chọn: PENDING, COMPLETED, hoặc CANCELLED',
      };
    }

    // Sheet 2: Hướng dẫn nhập liệu
    const instructionSheet = workbook.addWorksheet('Hướng dẫn nhập liệu', {
      views: [{ showGridLines: true }],
    });

    instructionSheet.columns = [
      { header: 'STT', key: 'index', width: 8 },
      { header: 'Tên cột', key: 'columnName', width: 26 },
      { header: 'Bắt buộc', key: 'isRequired', width: 14 },
      { header: 'Định dạng / Giá trị hợp lệ', key: 'format', width: 38 },
      { header: 'Ví dụ', key: 'example', width: 35 },
      { header: 'Ghi chú', key: 'note', width: 45 },
    ];

    instructionSheet.mergeCells('A1:F1');
    const titleCell = instructionSheet.getCell('A1');
    titleCell.value = 'HƯỚNG DẪN ĐIỀN DỮ LIỆU IMPORT LỊCH NHẮC NHỞ';
    titleCell.font = { name: 'Segoe UI', size: 14, bold: true, color: { argb: 'FF1E40AF' } };
    titleCell.alignment = { vertical: 'middle', horizontal: 'center' };
    instructionSheet.getRow(1).height = 36;

    instructionSheet.mergeCells('A2:F2');
    const noteCell = instructionSheet.getCell('A2');
    noteCell.value =
      'Vui lòng đọc kỹ các quy định bên dưới để đảm bảo dữ liệu import không bị lỗi. Các cột có dấu (*) là bắt buộc.';
    noteCell.font = { name: 'Segoe UI', size: 10, italic: true, color: { argb: 'FF64748B' } };
    noteCell.alignment = { vertical: 'middle', horizontal: 'center' };
    instructionSheet.getRow(2).height = 24;

    const instHeaderRow = instructionSheet.getRow(4);
    instHeaderRow.values = [
      'STT',
      'Tên cột',
      'Bắt buộc',
      'Định dạng / Giá trị hợp lệ',
      'Ví dụ',
      'Ghi chú',
    ];
    instHeaderRow.height = 28;
    instHeaderRow.eachCell((cell) => {
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FF334155' },
      };
      cell.font = {
        name: 'Segoe UI',
        size: 10,
        bold: true,
        color: { argb: 'FFFFFFFF' },
      };
      cell.alignment = { vertical: 'middle', horizontal: 'center' };
      cell.border = {
        top: { style: 'thin', color: { argb: 'FF94A3B8' } },
        left: { style: 'thin', color: { argb: 'FF94A3B8' } },
        bottom: { style: 'thin', color: { argb: 'FF94A3B8' } },
        right: { style: 'thin', color: { argb: 'FF94A3B8' } },
      };
    });

    const instructionData = [
      {
        index: 1,
        columnName: 'Tiêu đề (*)',
        isRequired: 'Có (*)',
        format: 'Chuỗi văn bản (Tối đa 255 ký tự)',
        example: 'Họp triển khai dự án',
        note: 'Không được để trống. Nội dung ngắn gọn, súc tích.',
      },
      {
        index: 2,
        columnName: 'Mô tả',
        isRequired: 'Không',
        format: 'Chuỗi văn bản',
        example: 'Thảo luận tiến độ và giao việc...',
        note: 'Có thể bỏ trống nếu không có thông tin bổ sung.',
      },
      {
        index: 3,
        columnName: 'Thời gian nhắc nhở (*)',
        isRequired: 'Có (*)',
        format: 'YYYY-MM-DD HH:mm (hoặc ngày hợp lệ)',
        example: '2026-10-05 09:00',
        note: 'Định dạng 24h. Bắt buộc phải có thời gian để kích hoạt nhắc nhở.',
      },
      {
        index: 4,
        columnName: 'Mức độ ưu tiên',
        isRequired: 'Không',
        format: 'LOW | MEDIUM | HIGH | URGENT',
        example: 'HIGH',
        note: 'Có dropdown chọn. Nếu để trống hệ thống sẽ tự đặt là MEDIUM.',
      },
      {
        index: 5,
        columnName: 'Trạng thái',
        isRequired: 'Không',
        format: 'PENDING | COMPLETED | CANCELLED',
        example: 'PENDING',
        note: 'Có dropdown chọn. Nếu để trống hệ thống sẽ tự đặt là PENDING.',
      },
    ];

    instructionData.forEach((item) => {
      const row = instructionSheet.addRow(item);
      row.height = 24;
      row.eachCell((cell, colNumber) => {
        cell.font = { name: 'Segoe UI', size: 10 };
        cell.border = {
          top: { style: 'thin', color: { argb: 'FFE2E8F0' } },
          left: { style: 'thin', color: { argb: 'FFE2E8F0' } },
          bottom: { style: 'thin', color: { argb: 'FFE2E8F0' } },
          right: { style: 'thin', color: { argb: 'FFE2E8F0' } },
        };
        if (colNumber === 1 || colNumber === 3) {
          cell.alignment = { vertical: 'middle', horizontal: 'center' };
        } else {
          cell.alignment = { vertical: 'middle', horizontal: 'left' };
        }
      });
    });

    const buffer = await workbook.xlsx.writeBuffer();
    return Buffer.from(buffer);
  }
}
