import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { I18nService } from '../../i18n/i18n.service';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);
  private readonly i18nService: I18nService;

  constructor(i18nService?: I18nService) {
    this.i18nService = i18nService || new I18nService();
  }

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const acceptLang = request.headers['accept-language'];
    const queryLang = request.query?.lang as string | undefined;
    const currentLang = this.i18nService.resolveLanguage(acceptLang, queryLang);

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message: string | object = this.i18nService.t('common.internalServerError', currentLang);


    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const res = exception.getResponse();
      const rawMsg = typeof res === 'object' && res !== null ? (res as any).message || res : res;

      if (Array.isArray(rawMsg)) {
        if (
          rawMsg.length > 0 &&
          typeof rawMsg[0] === 'object' &&
          rawMsg[0] !== null &&
          ('constraints' in rawMsg[0] || 'property' in rawMsg[0])
        ) {
          message = this.i18nService.translateValidationErrors(rawMsg as any, currentLang);
        } else {
          message = rawMsg.map((m) =>
            typeof m === 'string' ? this.i18nService.translateMessage(m, currentLang) : m
          );
        }
      } else if (typeof rawMsg === 'string') {
        message = this.i18nService.translateMessage(rawMsg, currentLang);
      } else {
        message = rawMsg;
      }
    } else if (exception instanceof Error) {

      if (exception.message.toLowerCase().includes('not found')) {
        status = HttpStatus.NOT_FOUND;
      } else {
        status = HttpStatus.BAD_REQUEST;
      }
      message = this.i18nService.translateMessage(exception.message, currentLang);
    }

    this.logger.error(
      `[${request.method}] ${request.url} - Lang: ${currentLang} - Status: ${status} - Error: ${JSON.stringify(message)}`
    );

    response.status(status).json({
      success: false,
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      message,
    });
  }
}


