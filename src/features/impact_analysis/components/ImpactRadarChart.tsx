// src/features/impact_analysis/components/ImpactRadarChart.tsx
import React from 'react';
import { Paper, Typography, Box } from '@mui/material';

export default function ImpactRadarChart() {
  return (
    <Paper elevation={3} sx={{ p: 2, height: '100%' }}>
      <Typography variant="h6" gutterBottom>
        Risk Radar Overview
      </Typography>
      <Box sx={{ mt: 2, textAlign: 'center' }}>
        [RadarChart Placeholder]
      </Box>
    </Paper>
  );
}
