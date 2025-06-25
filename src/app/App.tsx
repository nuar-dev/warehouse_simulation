// src/app/App.tsx

import React, { Suspense } from 'react';
import AppTheme from '@/shared-theme/AppTheme';
import { NotificationProvider } from '@/contexts/NotificationContext';
import LayoutProvider from '@/contexts/LayoutProvider';
import SnackbarProvider from '@/contexts/SnackbarProvider';
import { HashRouter } from 'react-router-dom';
import { DataSourceProvider } from '@/contexts/DataSourceContext';
import { SimulationSettingsProvider } from '@/contexts/SimulationSettingsContext';

import AppRouter from '@/router/AppRouter';

export default function App() {
  return (
    <AppTheme>
      <NotificationProvider>
        <SnackbarProvider
          maxSnack={3}
          autoHideDuration={4000}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        >
          <DataSourceProvider>
            <LayoutProvider>
              <SimulationSettingsProvider>
                <HashRouter>
                  <Suspense fallback={<div>Loading…</div>}>
                    <AppRouter />
                  </Suspense>
                </HashRouter>
              </SimulationSettingsProvider>
            </LayoutProvider>
          </DataSourceProvider>
        </SnackbarProvider>
      </NotificationProvider>
    </AppTheme>
  );
}
