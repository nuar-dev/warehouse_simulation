// src/contexts/SnackbarProvider.tsx
import React from 'react';
import { SnackbarProvider, SnackbarProviderProps, useSnackbar } from 'notistack';
import { IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

const CloseButton = () => {
  const { closeSnackbar } = useSnackbar();

  React.useEffect(() => {
    window.__enqueueSnackbarClose = closeSnackbar;
  }, [closeSnackbar]);

  return null;
};

export default function SnackbarProviderWrapper(props: SnackbarProviderProps) {
  return (
    <SnackbarProvider
      maxSnack={3}
      autoHideDuration={3000}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      preventDuplicate
      action={(key) => (
        <IconButton onClick={() => window.__enqueueSnackbarClose?.(key)} color="inherit">
          <CloseIcon />
        </IconButton>
      )}
      {...props} // forward all props properly
    >
      <CloseButton />
      {props.children}
    </SnackbarProvider>
  );
}
