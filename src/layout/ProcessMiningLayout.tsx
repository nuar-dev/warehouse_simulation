import * as React from 'react';
import { alpha } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import { Outlet } from 'react-router-dom';

import AppNavbar from '@/components/dashboard/components/AppNavbar';
import Header from '@/components/dashboard/components/Header';
import SideMenu from '@/components/dashboard/components/SideMenu';
import AppTheme from '@/components/shared-theme/AppTheme';

import {
  chartsCustomizations,
  dataGridCustomizations,
  datePickersCustomizations,
  treeViewCustomizations,
} from '@/components/dashboard/theme/customizations'

// Inject MUI X component customizations
const xThemeComponents = {
  ...chartsCustomizations,
  ...dataGridCustomizations,
  ...datePickersCustomizations,
  ...treeViewCustomizations,
};

export default function ProcessMiningLayout() {
  return (
    <AppTheme themeComponents={xThemeComponents}>
      <CssBaseline enableColorScheme />
      <Box sx={{ display: 'flex' }}>
        <SideMenu />
        <AppNavbar />
        <Box
          component="main"
          sx={(theme) => ({
            flexGrow: 1,
            backgroundColor: theme.vars
              ? `rgba(${theme.vars.palette.background.defaultChannel} / 1)`
              : alpha(theme.palette.background.default, 1),
            overflow: 'auto',
            p: 3,
            mt: 'calc(var(--template-frame-height, 0px) + 4px)',
          })}
        >
          <Stack
            spacing={2}
            sx={{
              alignItems: 'center',
              mx: 3,
              pb: 5,
              mt: { xs: 8, md: 0 },
            }}
          >
            <Header />
            <Outlet />
          </Stack>
        </Box>
      </Box>
    </AppTheme>
  );
}
