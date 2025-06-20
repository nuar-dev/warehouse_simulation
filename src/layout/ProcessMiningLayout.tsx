// src/layout/ProcessMiningLayout.tsx

import * as React from 'react';
import { alpha } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import { Outlet } from 'react-router-dom';

import { AppNavbar, Header, SideMenu } from '@/layout/components';
import AppTheme from '@/shared-theme/AppTheme';
import Footer from './components/Footer';

import { useLayoutContext } from '@/contexts/LayoutContext';

import {
  chartsCustomizations,
  dataGridCustomizations,
  datePickersCustomizations,
  treeViewCustomizations,
} from '@/theme/overrides';

// Combine MUI X component customizations
const xThemeComponents = {
  ...chartsCustomizations,
  ...dataGridCustomizations,
  ...datePickersCustomizations,
  ...treeViewCustomizations,
};

export default function ProcessMiningLayout() {
  const { footerContent } = useLayoutContext();

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
              // bottom padding to clear the footer (48px) + some gap
              pb: 7,
              mt: { xs: 8, md: 0 },
            }}
          >
            <Header />
            <Outlet />
          </Stack>

          {/* App‐wide footer: visual container */}
          <Footer>
            {/* Feature‐registered content (e.g. warehouse tabs) */}
            {footerContent}
          </Footer>
        </Box>
      </Box>
    </AppTheme>
  );
}
