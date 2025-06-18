// src/features/impact_analysis/pages/ImpactAnalysis.tsx

import { Box, Typography, Divider } from '@mui/material';
import Grid from '@mui/material/Grid';

import ImpactScoreGauge from '../components/ImpactScoreGauge';
import ImpactRadarChart from '../components/ImpactRadarChart';
import StakeholderRating from '../components/StakeholderRating';
import TimelineEvents from '../components/TimelineEvents';

export default function ImpactAnalysis() {
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        width: '100%',
        maxWidth: { sm: '100%', md: '1700px' },
        mx: 'auto',
        px: 2,
        py: 4,
      }}
    >
      <Box sx={{ width: '100%' }}>
        <Typography component="h2" variant="h4" sx={{ mb: 3, textAlign: 'center' }}>
          Impact Analysis
        </Typography>

        <Grid container spacing={2} sx={{ mb: 2 }}>
          <Grid size={{ xs: 12, md: 6 }}>
            <ImpactScoreGauge />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <ImpactRadarChart />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <StakeholderRating />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <TimelineEvents />
          </Grid>
        </Grid>

        <Divider sx={{ my: 4 }} />
        <Typography variant="body2" color="text.secondary" align="center">
          Generated for simulation overview — v1.0
        </Typography>
      </Box>
    </Box>
  );
}
