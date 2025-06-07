// src/App.tsx
import { Routes, Route, Navigate } from 'react-router-dom';
import AppTheme from './components/shared-theme/AppTheme';
import Dashboard from './components/dashboard/Dashboard';
import DashboardGrid from './components/dashboard/components/DashboardGrid';
import SimSettingGrid from './components/dashboard/components/SimSettingGrid';
import ImpactAnalysisGrid from './components/dashboard/components/ImpactAnalysisGrid';
import WarehouseGrid from './components/dashboard/components/WarehouseGrid';
import { NotificationProvider } from './contexts/NotificationContext';
import LayoutProvider from './contexts/LayoutProvider';
import SnackbarProvider from './contexts/SnackbarProvider';

export default function App() {
  return (
    <AppTheme>
      <NotificationProvider>
        <SnackbarProvider
          maxSnack={3}
          autoHideDuration={4000}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        >
          <LayoutProvider>
            <Routes>
              <Route path="/" element={<Dashboard />}>
                <Route index element={<DashboardGrid />} />
                <Route path="simSetting" element={<SimSettingGrid />} />
                <Route path="warehouse" element={<WarehouseGrid />} />
                <Route path="impactAnalysis" element={<ImpactAnalysisGrid />} />
                <Route path="settings" element={<div>Settings Page</div>} />
                <Route path="about" element={<div>About Page</div>} />
              </Route>
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </LayoutProvider>
        </SnackbarProvider>
      </NotificationProvider>
    </AppTheme>
  );
}
