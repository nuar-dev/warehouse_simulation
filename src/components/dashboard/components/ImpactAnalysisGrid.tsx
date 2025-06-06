import * as React from 'react';
import Box from '@mui/material/Box';
import { Grid } from '@mui/material';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Divider from '@mui/material/Divider';
import LinearProgress from '@mui/material/LinearProgress';
import Rating from '@mui/material/Rating';
import Avatar from '@mui/material/Avatar';
import Stack from '@mui/material/Stack';

function ImpactScoreGauge() {
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

function ImpactRadarChart() {
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

function StakeholderRating() {
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

function TimelineEvents() {
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

export default function ImpactAnalysisGrid() {
  return (
    <Box sx={{ width: '100%', px: 2, py: 4 }}>
      <Typography variant="h4" gutterBottom textAlign="center">
        Impact Analysis
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6} {...({} as any)}>
          <ImpactScoreGauge />
        </Grid>
        <Grid item xs={12} md={6} {...({} as any)}>
          <ImpactRadarChart />
        </Grid>
        <Grid item xs={12} md={6} {...({} as any)}>
          <StakeholderRating />
        </Grid>
        <Grid item xs={12} md={6} {...({} as any)}>
          <TimelineEvents />
        </Grid>
      </Grid>

      <Divider sx={{ mt: 4, mb: 2 }} />
      <Typography variant="body2" color="text.secondary" align="center">
        Generated for simulation overview — v1.0
      </Typography>
    </Box>
  );
}
