export type SupportedLanguage = 'vi' | 'en';

export interface I18nDictionary {
  auth: {
    emailPasswordInvalid: string;
    userDisabled: string;
    emailExists: string;
    phoneExists: string;
    userNotFound: string;
    tokenMissing: string;
    tokenInvalid: string;
    registeredSuccess: string;
    loginSuccess: string;
  };
  reminders: {
    notFound: string;
    titleEmpty: string;
    cannotCompleteCancelled: string;
    cannotCancelCompleted: string;
    cannotRescheduleCompleted: string;
    createdSuccess: string;
    updatedSuccess: string;
    deletedSuccess: string;
  };
  validation: {
    isNotEmpty: string;
    isEmail: string;
    minLength: string;
    maxLength: string;
    isDateString: string;
    isEnum: string;
    isString: string;
  };
  common: {
    internalServerError: string;
    badRequest: string;
    unauthorized: string;
    notFound: string;
  };
}
