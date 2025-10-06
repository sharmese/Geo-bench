// src/hooks/useErrorHandler.ts

import { useState, useCallback } from 'react';
import { getErrorMessage } from '../constants/errorMessages';

interface ErrorHookResult {
  errorMessage: string;
  setErrorMessage: React.Dispatch<React.SetStateAction<string>>;
  handleBackendError: (error: any) => void;
  resetError: () => void;
}

export const useErrorHandler = (): ErrorHookResult => {
  const [errorMessage, setErrorMessage] = useState('');

  const handleBackendError = useCallback((error: any) => {
    const errorCode = error?.code;

    if (errorCode) {
      const message = getErrorMessage(errorCode);
      setErrorMessage(message);
    } else {
      setErrorMessage(error?.message || 'Unknown error occurred');
    }
  }, []);

  const resetError = useCallback(() => {
    setErrorMessage('');
  }, []);

  return { errorMessage, setErrorMessage, handleBackendError, resetError };
};
