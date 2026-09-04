import { I18nDictionary } from '../i18n.types';

export const viLocale: I18nDictionary = {
  auth: {
    emailPasswordInvalid: 'Email hoặc mật khẩu không chính xác',
    userDisabled: 'Tài khoản của bạn đã bị vô hiệu hóa. Vui lòng liên hệ quản trị viên',
    emailExists: 'Email "{email}" đã được sử dụng. Vui lòng chọn email khác',
    phoneExists: 'Số điện thoại "{phone}" đã được sử dụng',
    userNotFound: 'Không tìm thấy tài khoản người dùng',
    tokenMissing: 'Không tìm thấy Bearer token xác thực',
    tokenInvalid: 'Token xác thực không hợp lệ hoặc đã hết hạn',
    registeredSuccess: 'Đăng ký tài khoản thành công',
    loginSuccess: 'Đăng nhập thành công',
  },
  reminders: {
    notFound: 'Không tìm thấy lịch nhắc với ID "{id}"',
    titleEmpty: 'Tiêu đề lịch nhắc không được để trống',
    cannotCompleteCancelled: 'Không thể hoàn thành lịch nhắc đã bị hủy',
    cannotCancelCompleted: 'Không thể hủy lịch nhắc đã hoàn thành',
    cannotRescheduleCompleted: 'Không thể dời lịch nhắc đã hoàn thành',
    createdSuccess: 'Tạo lịch nhắc thành công',
    updatedSuccess: 'Cập nhật lịch nhắc thành công',
    deletedSuccess: 'Xóa lịch nhắc thành công',
  },
  validation: {
    isNotEmpty: '{field} không được để trống',
    isEmail: '{field} không phải là địa chỉ email hợp lệ',
    minLength: '{field} phải có ít nhất {min} ký tự',
    maxLength: '{field} không được vượt quá {max} ký tự',
    isDateString: '{field} phải là chuỗi định dạng ngày hợp lệ (ISO 8601)',
    isEnum: '{field} phải là một trong các giá trị: {values}',
    isString: '{field} phải là chuỗi ký tự',
  },
  common: {
    internalServerError: 'Lỗi máy chủ nội bộ. Vui lòng thử lại sau',
    badRequest: 'Yêu cầu không hợp lệ',
    unauthorized: 'Chưa đăng nhập hoặc không có quyền truy cập',
    notFound: 'Tài nguyên yêu cầu không tồn tại',
  },
};
