import * as React from 'react';
import { createContext, useContext, useState, useCallback } from 'react';
import { FlashMessage } from '@/components/molecules/flash-message';
import { ErrorModal } from '@/components/organisms/error-modal';

export interface FeedbackContextType {
  showSuccess: (message: string, duration?: number) => void;
  showError: (message: string, title?: string) => void;
  closeSuccess: () => void;
  closeError: () => void;
}

const FeedbackContext = createContext<FeedbackContextType | undefined>(undefined);

export const FeedbackProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [successDuration, setSuccessDuration] = useState<number>(3500);

  const [isErrorModalOpen, setIsErrorModalOpen] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [errorTitle, setErrorTitle] = useState<string | null>(null);

  const showSuccess = useCallback((message: string, duration = 3500) => {
    setSuccessMessage(message);
    setSuccessDuration(duration);
  }, []);

  const closeSuccess = useCallback(() => {
    setSuccessMessage(null);
  }, []);

  const showError = useCallback((message: string, title?: string) => {
    setErrorMessage(message);
    setErrorTitle(title || null);
    setIsErrorModalOpen(true);
  }, []);

  const closeError = useCallback(() => {
    setIsErrorModalOpen(false);
    setErrorMessage(null);
    setErrorTitle(null);
  }, []);

  return (
    <FeedbackContext.Provider value={{ showSuccess, showError, closeSuccess, closeError }}>
      {children}

      {/* Flash Message ở góc dưới bên phải (Bottom-Right) */}
      <FlashMessage message={successMessage} duration={successDuration} onClose={closeSuccess} />

      {/* Modal báo lỗi hiển thị chính giữa màn hình (Error Modal) */}
      <ErrorModal
        isOpen={isErrorModalOpen}
        title={errorTitle}
        message={errorMessage}
        onClose={closeError}
      />
    </FeedbackContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export function useFeedback(): FeedbackContextType {
  const context = useContext(FeedbackContext);
  if (!context) {
    throw new Error('useFeedback must be used within a FeedbackProvider');
  }
  return context;
}
