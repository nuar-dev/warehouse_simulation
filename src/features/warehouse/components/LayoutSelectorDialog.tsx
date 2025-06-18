// src/features/warehouse/components/LayoutSelectorDialog.tsx
import React from 'react';
import {
  Modal,
  Paper,
  Typography,
  Stack,
  Button,
  styled,
} from '@mui/material';
import { useLayoutContext } from '@/contexts/LayoutContext';
import { useNavigate } from 'react-router-dom';

const CenteredModal = styled(Modal)({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
});

export default function LayoutSelectorDialog() {
  const {
    openSelector,
    closeSelector,
    loadDefaultLayout,
    loadLayoutFromFile,
  } = useLayoutContext();

  const navigate = useNavigate();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) loadLayoutFromFile(file);
  };

  return (
    <CenteredModal open={openSelector} onClose={closeSelector}>
      <Paper sx={{ p: 4, width: 400 }}>
        <Typography variant="h6" gutterBottom>
          Load Warehouse Layout
        </Typography>
        <Stack spacing={2}>
          <Button variant="contained" onClick={loadDefaultLayout}>
            Use Default Layout
          </Button>
          <Button variant="contained" component="label">
            Upload Layout File
            <input type="file" accept=".json" hidden onChange={handleFileChange} />
          </Button>
          <Button
            variant="contained"
            onClick={() => {
              closeSelector();
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
