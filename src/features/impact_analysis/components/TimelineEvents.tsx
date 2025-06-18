// src/features/impact_analysis/components/TimelineEvents.tsx
import React from 'react';
import { Paper, Typography } from '@mui/material';

export default function TimelineEvents() {
  return (
    <Paper elevation={3} sx={{ p: 2 }}>
      <Typography variant="h6" gutterBottom>
        Timeline Events
      </Typography>
      <Typography variant="body2" sx={{ mb: 1 }}>
        - 2024-06-01: System audit completed.
      </Typography>
      <Typography variant="body2">
        - 2024-06-03: Detected warehouse bottlenecks.
      </Typography>
    </Paper>
  );
}
