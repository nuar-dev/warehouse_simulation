// SnackbarContext.tsx
import React, { createContext, useContext, useState, useCallback } from 'react';
import { Snackbar, Alert } from '@mui/material';

interface SnackbarContextType {
  showSnackbar: (message: string, severity?: 'success' | 'info' | 'warning' | 'error') => void;
}

const SnackbarContext = createContext<SnackbarContextType | undefined>(undefined);

export const useSnackbarContext = () => {
  const context = useContext(SnackbarContext);
  if (!context) throw new Error('useSnackbarContext must be used within a SnackbarProvider');
  return context;
};

export const SnackbarProvider = ({ children }: { children: React.ReactNode }) => {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [severity, setSeverity] = useState<'success' | 'info' | 'warning' | 'error'>('info');

  const showSnackbar = useCallback((msg: string, sev: typeof severity = 'info') => {
    setMessage(msg);
    setSeverity(sev);
    setOpen(true);
  }, []);

  const handleClose = () => setOpen(false);

  return (
    <SnackbarContext.Provider value={{ showSnackbar }}>
      <>
        {children}
        <Snackbar
          open={open}
          autoHideDuration={2500}
          onClose={handleClose}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        >
          <Alert
            onClose={handleClose}
            severity={severity}
            variant="filled"
            sx={{ width: '100%' }}
          >
            {message}
          </Alert>
        </Snackbar>
      </>
    </SnackbarContext.Provider>
  );
};
