import { NestFactory } from '@nestjs/core';
import { Logger, ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './modules/app.module';
import { AllExceptionsFilter } from './infrastructure/common/filters/http-exception.filter';
import { TransformResponseInterceptor } from './infrastructure/common/interceptors/transform-response.interceptor';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  const app = await NestFactory.create(AppModule);

  // Global API Prefix (dễ dàng thay đổi phiên bản API qua biến môi trường)
  const apiPrefix = process.env.API_PREFIX || 'api/v1';
  app.setGlobalPrefix(apiPrefix);

  // Enable CORS
  app.enableCors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });

  // Global Validation Pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    })
  );

  // Global Interceptor & Filter
  app.useGlobalInterceptors(new TransformResponseInterceptor());
  app.useGlobalFilters(new AllExceptionsFilter());

  // Swagger Documentation Setup
  const config = new DocumentBuilder()
    .setTitle('Remind Schedule REST API')
    .setDescription('Tài liệu RESTful API hệ thống Remind Schedule thiết kế theo The Clean Architecture')
    .setVersion('1.0.0')
    .addTag('Authentication', 'Các API xác thực người dùng')
    .addTag('Reminders', 'Các API quản lý lịch nhắc')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  const port = process.env.PORT || 3000;
  await app.listen(port);
  logger.log(`🚀 Server đang chạy tại: http://localhost:${port}`);
  logger.log(`📖 Swagger API Docs xem tại: http://localhost:${port}/api/docs`);
}

bootstrap();

