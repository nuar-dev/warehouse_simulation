// src/features/warehouse/components/LayoutSelectorDialog.tsx

import React from 'react';
import {
  Modal,
  Paper,
  Typography,
  Stack,
  Button,
  IconButton,
  styled,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useLayoutContext } from '@/contexts/LayoutContext';
import { useNavigate } from 'react-router-dom';

const CenteredModal = styled(Modal)({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
});

interface LayoutSelectorDialogProps {
  open: boolean;
  onClose: () => void;
}

export default function LayoutSelectorDialog({
  open,
  onClose,
}: LayoutSelectorDialogProps) {
  const {
    loadDefaultLayout,
    loadLayoutFromFile,
  } = useLayoutContext();
  const navigate = useNavigate();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      loadLayoutFromFile(file);
      onClose();
    }
  };

  const handleUseDefault = () => {
    loadDefaultLayout();
    onClose();
  };

  return (
    <CenteredModal
      open={open}
      onClose={onClose}
      // ensure escape & backdrop click both fire onClose
      closeAfterTransition
    >
      <Paper
        sx={{
          position: 'relative',
          p: 4,
          width: 400,
        }}
        elevation={3}
      >
        {/* Explicit close button */}
        <IconButton
          onClick={onClose}
          size="small"
          sx={{
            position: 'absolute',
            top: 8,
            right: 8,
          }}
        >
          <CloseIcon />
        </IconButton>

        <Typography variant="h6" gutterBottom>
          Load Warehouse Layout
        </Typography>
        <Stack spacing={2}>
          <Button variant="contained" onClick={handleUseDefault}>
            Use Default Layout
          </Button>
          <Button variant="contained" component="label">
            Upload Layout File
            <input
              type="file"
              accept=".json"
              hidden
              onChange={handleFileChange}
            />
          </Button>
          <Button
            variant="contained"
            onClick={() => {
              onClose();
              navigate('/warehouse/custom');
            }}
          >
            Define Custom Layout
          </Button>
        </Stack>
      </Paper>
    </CenteredModal>
  );
}
