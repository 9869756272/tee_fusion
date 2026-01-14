import React, { createContext, useContext, useState, useCallback } from 'react';
import ConfirmationDialog from '../components/ConfirmationDialog.jsx';

const ConfirmationContext = createContext(null);

export const ConfirmationProvider = ({ children }) => {
  const [dialog, setDialog] = useState(null);

  const confirm = useCallback((options) => {
    return new Promise((resolve) => {
      setDialog({
        ...options,
        onConfirm: () => {
          resolve(true);
          setDialog(null);
        },
        onClose: () => {
          resolve(false);
          setDialog(null);
        },
      });
    });
  }, []);

  return (
    <ConfirmationContext.Provider value={{ confirm }}>
      {children}
      {dialog && (
        <ConfirmationDialog
          isOpen={true}
          title={dialog.title || 'Confirm Action'}
          message={dialog.message || 'Are you sure you want to proceed?'}
          confirmText={dialog.confirmText || 'Confirm'}
          cancelText={dialog.cancelText || 'Cancel'}
          type={dialog.type || 'warning'}
          onConfirm={dialog.onConfirm}
          onClose={dialog.onClose}
        />
      )}
    </ConfirmationContext.Provider>
  );
};

export const useConfirmation = () => {
  const context = useContext(ConfirmationContext);
  if (!context) {
    throw new Error('useConfirmation must be used within a ConfirmationProvider');
  }
  return context;
};










