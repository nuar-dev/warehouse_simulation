import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Button,
} from '@mui/material';

type LayoutSettingsDialogProps = {
  open: boolean;
  onClose: () => void;
};

export default function LayoutSettingsDialog({
  open,
  onClose,
}: LayoutSettingsDialogProps) {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Layout Settings</DialogTitle>
      <DialogContent dividers>
        <Typography variant="body1">
          Grid size and metadata configuration coming soon...
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
}
