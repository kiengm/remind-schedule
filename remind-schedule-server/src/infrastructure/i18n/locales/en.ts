import { I18nDictionary } from '../i18n.types';

export const enLocale: I18nDictionary = {
  auth: {
    emailPasswordInvalid: 'Incorrect email or password',
    userDisabled: 'Your account has been deactivated. Please contact administrator',
    emailExists: 'Email "{email}" is already in use. Please choose another email',
    phoneExists: 'Phone number "{phone}" is already in use',
    userNotFound: 'User account not found',
    tokenMissing: 'Bearer authentication token not found',
    tokenInvalid: 'Authentication token is invalid or has expired',
    registeredSuccess: 'Account registered successfully',
    loginSuccess: 'Logged in successfully',
  },
  reminders: {
    notFound: 'Reminder with ID "{id}" not found',
    titleEmpty: 'Reminder title cannot be empty',
    cannotCompleteCancelled: 'Cannot complete a cancelled reminder',
    cannotCancelCompleted: 'Cannot cancel a completed reminder',
    cannotRescheduleCompleted: 'Cannot reschedule an already completed reminder',
    createdSuccess: 'Reminder created successfully',
    updatedSuccess: 'Reminder updated successfully',
    deletedSuccess: 'Reminder deleted successfully',
  },
  validation: {
    isNotEmpty: '{field} should not be empty',
    isEmail: '{field} must be a valid email address',
    minLength: '{field} must be longer than or equal to {min} characters',
    maxLength: '{field} must be shorter than or equal to {max} characters',
    isDateString: '{field} must be a valid ISO 8601 date string',
    isEnum: '{field} must be one of the following values: {values}',
    isString: '{field} must be a string',
  },
  common: {
    internalServerError: 'Internal server error. Please try again later',
    badRequest: 'Bad request',
    unauthorized: 'Unauthorized or invalid credentials',
    notFound: 'Requested resource not found',
  },
};
