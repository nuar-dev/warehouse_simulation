// src/features/app_settings/pages/AppSettingsPage.tsx
import * as React from 'react';
import { Box, Typography } from '@mui/material';

export default function AppSettings() {
  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" gutterBottom>
        App Settings
      </Typography>
      <Typography variant="body1" color="text.secondary">
        This page is currently empty. Settings UI will be added here.
      </Typography>
    </Box>
  );
}
