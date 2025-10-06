
import { AxiosError } from 'axios';
import { ERROR_CODES } from '../../constants/errorCodes';

export const handleApiError = (error: unknown): never => {
  const axiosError = error as AxiosError;
  let thrownError: Error;

  if (axiosError.response) {
    const status = axiosError.response.status;
    const data = axiosError.response.data as { message?: string };

    const message = data.message || `API error with status ${status}`;

    if (status === 401) {
      thrownError = new Error(message);
      (thrownError as any).code = ERROR_CODES.UNAUTHORIZED;
      throw thrownError;
    }

    if (status === 409) {
      thrownError = new Error(message);
      (thrownError as any).code = ERROR_CODES.CONFLICT_EXISTS;
      throw thrownError;
    }

    if (status === 400) {
      thrownError = new Error(message);
      (thrownError as any).code = ERROR_CODES.MISSING_FIELDS;
      throw thrownError;
    }

    thrownError = new Error(message);
    (thrownError as any).code = ERROR_CODES.SERVER_ERROR;
    throw thrownError;
  } else {
    thrownError = new Error('Network error');
    (thrownError as any).code = ERROR_CODES.NETWORK_ERROR;
    throw thrownError;
  }
};
