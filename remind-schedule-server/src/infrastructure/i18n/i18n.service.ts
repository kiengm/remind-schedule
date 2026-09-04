import { Injectable, ValidationError } from '@nestjs/common';
import { SupportedLanguage } from './i18n.types';
import { viLocale } from './locales/vi';
import { enLocale } from './locales/en';

const locales = {
  vi: viLocale,
  en: enLocale,
};

@Injectable()
export class I18nService {
  /**
   * Trích xuất và chuẩn hóa ngôn ngữ từ header hoặc query
   */
  resolveLanguage(acceptLanguageHeader?: string, langQuery?: string): SupportedLanguage {
    if (langQuery) {
      const lower = langQuery.toLowerCase();
      if (lower.startsWith('en')) return 'en';
      if (lower.startsWith('vi')) return 'vi';
    }

    if (acceptLanguageHeader) {
      const lower = acceptLanguageHeader.toLowerCase();
      // Kiểm tra xem tiếng Anh có độ ưu tiên cao hơn hay xuất hiện trước
      if (lower.startsWith('en') || lower.includes('en-us') || lower.includes('en-gb')) {
        return 'en';
      }
    }

    return 'vi';
  }

  /**
   * Lấy chuỗi bản dịch theo key (dạng 'auth.emailPasswordInvalid')
   */

  t(key: string, lang: SupportedLanguage = 'vi', args?: Record<string, any>): string {
    const dict = locales[lang] || locales.vi;
    const parts = key.split('.');

    let current: any = dict;
    for (const part of parts) {
      if (current && typeof current === 'object' && part in current) {
        current = current[part];
      } else {
        current = null;
        break;
      }
    }

    // Nếu không tìm thấy trong ngôn ngữ yêu cầu, fallback sang tiếng Việt
    if (typeof current !== 'string') {
      let fallback: any = locales.vi;
      for (const part of parts) {
        if (fallback && typeof fallback === 'object' && part in fallback) {
          fallback = fallback[part];
        } else {
          fallback = null;
          break;
        }
      }
      current = typeof fallback === 'string' ? fallback : key;
    }

    // Thay thế template {arg}
    if (typeof current === 'string' && args) {
      return Object.entries(args).reduce(
        (acc, [k, v]) => acc.replace(new RegExp(`\\{${k}\\}`, 'g'), String(v)),
        current
      );
    }

    return current;
  }

  /**
   * Tự động dịch một thông báo lỗi bất kỳ (hỗ trợ translation key, fallback map, hoặc chuỗi nguyên bản)
   */
  translateMessage(rawMessage: string, lang: SupportedLanguage): string {
    if (!rawMessage || typeof rawMessage !== 'string') {
      return rawMessage;
    }

    // 1. Nếu là translation key hợp lệ
    if (rawMessage.startsWith('auth.') || rawMessage.startsWith('reminders.') || rawMessage.startsWith('common.')) {
      return this.t(rawMessage, lang);
    }

    // 2. Map chuỗi tĩnh hiện tại sang ngôn ngữ tương ứng
    // Auth messages
    if (rawMessage.includes('Email hoặc mật khẩu không chính xác') || rawMessage.includes('Incorrect email or password')) {
      return this.t('auth.emailPasswordInvalid', lang);
    }
    if (rawMessage.includes('vô hiệu hóa') || rawMessage.includes('deactivated')) {
      return this.t('auth.userDisabled', lang);
    }
    if (rawMessage.includes('đã được sử dụng. Vui lòng chọn email khác') || rawMessage.includes('already in use. Please choose another email')) {
      const match = rawMessage.match(/["']([^"']+)["']/);
      return this.t('auth.emailExists', lang, { email: match ? match[1] : '' });
    }
    if (rawMessage.includes('Số điện thoại') && rawMessage.includes('đã được sử dụng')) {
      const match = rawMessage.match(/["']([^"']+)["']/);
      return this.t('auth.phoneExists', lang, { phone: match ? match[1] : '' });
    }
    if (rawMessage.includes('Không tìm thấy tài khoản người dùng') || rawMessage.includes('User account not found')) {
      return this.t('auth.userNotFound', lang);
    }
    if (rawMessage.includes('Không tìm thấy Bearer token xác thực') || rawMessage.includes('Bearer authentication token not found')) {
      return this.t('auth.tokenMissing', lang);
    }
    if (rawMessage.includes('Token xác thực không hợp lệ') || rawMessage.includes('Authentication token is invalid')) {
      return this.t('auth.tokenInvalid', lang);
    }

    // Reminder messages
    if (rawMessage.toLowerCase().includes('not found') || rawMessage.includes('Không tìm thấy lịch nhắc')) {
      const match = rawMessage.match(/["']([^"']+)["']/);
      return this.t('reminders.notFound', lang, { id: match ? match[1] : '' });
    }
    if (rawMessage.toLowerCase().includes('title cannot be empty') || rawMessage.includes('Tiêu đề') && rawMessage.includes('không được để trống')) {
      return this.t('reminders.titleEmpty', lang);
    }
    if (rawMessage.toLowerCase().includes('cannot complete a cancelled reminder')) {
      return this.t('reminders.cannotCompleteCancelled', lang);
    }
    if (rawMessage.toLowerCase().includes('cannot cancel a completed reminder')) {
      return this.t('reminders.cannotCancelCompleted', lang);
    }
    if (rawMessage.toLowerCase().includes('cannot reschedule an already completed reminder')) {
      return this.t('reminders.cannotRescheduleCompleted', lang);
    }

    return rawMessage;
  }

  /**
   * Dịch mảng lỗi ValidationError từ class-validator
   */
  translateValidationErrors(errors: ValidationError[], lang: SupportedLanguage): string[] {
    const messages: string[] = [];

    const recurse = (errList: ValidationError[]) => {
      for (const err of errList) {
        if (err.constraints) {
          for (const [constraintName] of Object.entries(err.constraints)) {
            const field = err.property;
            const translated = this.formatConstraintMessage(constraintName, field, lang);
            messages.push(translated);
          }
        }
        if (err.children && err.children.length > 0) {
          recurse(err.children);
        }
      }
    };

    recurse(errors);
    return messages;
  }

  private formatConstraintMessage(constraint: string, field: string, lang: SupportedLanguage): string {
    const isEn = lang === 'en';
    switch (constraint) {
      case 'isNotEmpty':
        return isEn ? `${field} should not be empty` : `${field} không được để trống`;
      case 'isEmail':
        return isEn ? `${field} must be a valid email address` : `${field} phải là địa chỉ email hợp lệ`;
      case 'minLength':
        return isEn ? `${field} is too short` : `${field} quá ngắn`;
      case 'maxLength':
        return isEn ? `${field} is too long` : `${field} quá dài`;
      case 'isDateString':
        return isEn ? `${field} must be a valid ISO 8601 date string` : `${field} phải là định dạng ngày ISO 8601 hợp lệ`;
      case 'isEnum':
        return isEn ? `${field} has an invalid value` : `${field} có giá trị không hợp lệ`;
      case 'isString':
        return isEn ? `${field} must be a string` : `${field} phải là chuỗi ký tự`;
      default:
        return isEn ? `${field} is invalid` : `${field} không hợp lệ`;
    }
  }
}

