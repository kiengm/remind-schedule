import { NestFactory } from '@nestjs/core';
import { BadRequestException, Logger, ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './modules/app.module';
import { AllExceptionsFilter } from './infrastructure/common/filters/http-exception.filter';
import { TransformResponseInterceptor } from './infrastructure/common/interceptors/transform-response.interceptor';
import { I18nService } from './infrastructure/i18n/i18n.service';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  const app = await NestFactory.create(AppModule);

  const i18nService = app.get(I18nService);

  // Enable CORS
  app.enableCors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });

  // Global Validation Pipe with i18n support
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
      exceptionFactory: (errors) => new BadRequestException(errors),
    })
  );

  // Global Interceptor & Filter
  app.useGlobalInterceptors(new TransformResponseInterceptor());
  app.useGlobalFilters(new AllExceptionsFilter(i18nService));


  // Swagger Documentation Setup
  const config = new DocumentBuilder()
    .setTitle('Remind Schedule REST API')
    .setDescription('Tài liệu RESTful API hệ thống Remind Schedule thiết kế theo The Clean Architecture')
    .setVersion('1.0.0')
    .addTag('Reminders', 'Các API quản lý lịch nhắc')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  const port = process.env.PORT || 3000;
  await app.listen(port);
  logger.log(`🚀 Server đang chạy tại: http://localhost:${port}`);
  logger.log(`📖 Swagger API Docs xem tại: http://localhost:${port}/api/docs`);
}

bootstrap();

