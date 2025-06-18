// src/features/impact_analysis/components/ImpactScoreGauge.tsx
import React from 'react';
import { Paper, Typography, LinearProgress } from '@mui/material';

export default function ImpactScoreGauge() {
  return (
    <Paper elevation={3} sx={{ p: 2 }}>
      <Typography variant="h6" gutterBottom>
        Impact Score
      </Typography>
      <LinearProgress variant="determinate" value={72} sx={{ height: 10, borderRadius: 5 }} />
      <Typography variant="body2" sx={{ mt: 1 }}>
        72% of KPIs are currently affected.
      </Typography>
    </Paper>
  );
}
