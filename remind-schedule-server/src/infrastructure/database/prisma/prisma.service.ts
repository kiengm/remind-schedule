import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(PrismaService.name);

  async onModuleInit() {
    try {
      await this.$connect();
      this.logger.log('✅ Đã kết nối thành công tới cơ sở dữ liệu MySQL thông qua Prisma');
    } catch (error) {
      this.logger.warn(
        '⚠️ Chưa thể kết nối tới MySQL database (hãy đảm bảo MySQL đang chạy và kiểm tra DATABASE_URL trong file .env)'
      );
    }
  }

  async onModuleDestroy() {
    await this.$disconnect();
    this.logger.log('Đã ngắt kết nối Prisma Client');
  }
}

