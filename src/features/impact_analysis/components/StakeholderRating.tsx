// src/features/impact_analysis/components/StakeholderRating.tsx
import React from 'react';
import { Paper, Typography, Avatar, Rating, Box, Stack } from '@mui/material';

export default function StakeholderRating() {
  return (
    <Paper elevation={3} sx={{ p: 2 }}>
      <Typography variant="h6" gutterBottom>
        Stakeholder Sentiment
      </Typography>
      <Stack direction="row" spacing={2} alignItems="center">
        <Avatar>JD</Avatar>
        <Box>
          <Typography variant="body2">John Doe</Typography>
          <Rating value={4} readOnly />
        </Box>
      </Stack>
      <Stack direction="row" spacing={2} alignItems="center" sx={{ mt: 2 }}>
        <Avatar>MS</Avatar>
        <Box>
          <Typography variant="body2">Maria Smith</Typography>
          <Rating value={3} readOnly />
        </Box>
      </Stack>
    </Paper>
  );
}
