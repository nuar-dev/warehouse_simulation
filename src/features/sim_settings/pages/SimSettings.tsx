import { Box, Typography, Stack } from '@mui/material';
import Grid from '@mui/material/Grid';

import Copyright from '@/components/ui/Copyright';
import ChartUserByCountry from '@/features/dashboard/components/ChartUserByCountry';
import CustomizedTreeView from '@/components/ui/CustomizedTreeView';
import CustomizedDataGrid from '@/components/ui/CustomizedDataGrid';
import HighlightedCard from '@/components/ui/HighlightedCard';
import PageViewsBarChart from '@/features/dashboard/components/PageViewsBarChart';
import SessionsChart from '@/features/dashboard/components/SessionsChart';
import StatCard, { StatCardProps } from '@/components/ui/StatCard';

type SimSettingProps = {
  statCards: StatCardProps[];
};

export default function SimSetting({ statCards }: SimSettingProps) {
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
          📊 Dashboard Summary
        </Typography>

        <Grid container spacing={2} sx={{ mb: 2 }}>
          {statCards.map((card, index) => (
            <Grid key={index} size={{ xs: 12, sm: 6, lg: 3 }}>
              <StatCard {...card} />
            </Grid>
          ))}
          <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
            <HighlightedCard />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <SessionsChart />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <PageViewsBarChart />
          </Grid>
        </Grid>

        <Typography component="h2" variant="h6" sx={{ mb: 2, textAlign: 'center' }}>
          🧾 Data & Insights
        </Typography>

        <Grid container spacing={2}>
          <Grid size={{ xs: 12, lg: 9 }}>
            <CustomizedDataGrid />
          </Grid>
          <Grid size={{ xs: 12, lg: 3 }}>
            <Stack gap={2} direction={{ xs: 'column', sm: 'row', lg: 'column' }}>
              <CustomizedTreeView />
              <ChartUserByCountry />
            </Stack>
          </Grid>
        </Grid>

        <Copyright sx={{ my: 4 }} />
      </Box>
    </Box>
  );
}
