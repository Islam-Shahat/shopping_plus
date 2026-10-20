import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import CustomModal from '../components/CustomModal';

const ModalContext = createContext({
  showAlert: () => {},
  showConfirm: () => {},
  closeModal: () => {}
});

export function ModalProvider({ children }) {
  const [modalState, setModalState] = useState({
    isOpen: false,
    title: '',
    message: '',
    type: 'info',
    confirmText: '',
    cancelText: 'إلغاء',
    onConfirm: null,
    isConfirm: false
  });

  const closeModal = useCallback(() => {
    setModalState((prev) => ({ ...prev, isOpen: false }));
  }, []);

  const showAlert = useCallback(({
    title = '',
    message = '',
    type = 'warning',
    confirmText = 'حسناً، فهمت',
    onConfirm = null
  }) => {
    setModalState({
      isOpen: true,
      title,
      message,
      type,
      confirmText,
      cancelText: '',
      onConfirm,
      isConfirm: false
    });
  }, []);

  const showConfirm = useCallback(({
    title = 'تأكيد الإجراء',
    message = '',
    type = 'confirm',
    confirmText = 'نعم، متأكد',
    cancelText = 'إلغاء',
    onConfirm = () => {}
  }) => {
    setModalState({
      isOpen: true,
      title,
      message,
      type,
      confirmText,
      cancelText,
      onConfirm,
      isConfirm: true
    });
  }, []);

  // Override window.alert globally so ANY native alert gets redirected to this custom popup
  useEffect(() => {
    const originalAlert = window.alert;
    window.alert = (msg) => {
      showAlert({
        title: 'تنبيه',
        message: String(msg || ''),
        type: 'warning',
        confirmText: 'حسناً'
      });
    };

    return () => {
      window.alert = originalAlert;
    };
  }, [showAlert]);

  return (
    <ModalContext.Provider value={{ showAlert, showConfirm, closeModal }}>
      {children}
      <CustomModal
        isOpen={modalState.isOpen}
        title={modalState.title}
        message={modalState.message}
        type={modalState.type}
        confirmText={modalState.confirmText}
        cancelText={modalState.cancelText}
        isConfirm={modalState.isConfirm}
        onConfirm={modalState.onConfirm}
        onClose={closeModal}
      />
    </ModalContext.Provider>
  );
}

export function useModal() {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error('useModal must be used within a ModalProvider');
  }
  return context;
}
