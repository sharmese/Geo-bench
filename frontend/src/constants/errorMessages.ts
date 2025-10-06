import { ERROR_CODES } from './errorCodes';

export const ERROR_MESSAGES_EN: Record<string, string> = {
  [ERROR_CODES.NETWORK_ERROR]:
    'Network error. Please check your internet connection and try again.',
  [ERROR_CODES.SERVER_ERROR]:
    'Server error. Please try again later or contact support.',

  [ERROR_CODES.CONFLICT_EXISTS]:
    'User with this email or username already exists. Please use different credentials.',
  [ERROR_CODES.INVALID_DATA]:
    'Invalid data provided. Please check your input and try again.',
  [ERROR_CODES.UNAUTHORIZED]:
    'Session expired or invalid credentials. Please log in again.',

  [ERROR_CODES.MISSING_FIELDS]:
    'Missing required fields. Please fill in all mandatory fields.',

  DEFAULT: 'An unexpected error occurred. Please try again later.',
};

export const getErrorMessage = (code: string): string => {
  return ERROR_MESSAGES_EN[code] || ERROR_MESSAGES_EN.DEFAULT;
};
