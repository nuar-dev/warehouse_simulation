// src/features/app_settings/pages/AppSettingsPage.tsx
import * as React from 'react';
import { Box, Typography } from '@mui/material';

export default function About() {
  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" gutterBottom>
        About
      </Typography>
      <Typography variant="body1" color="text.secondary">
        This page is currently empty. Information be added here.
      </Typography>
    </Box>
  );
}
