import { Routes, Route, Navigate } from 'react-router-dom';
import AppTheme from './components/shared-theme/AppTheme';
import Dashboard from './components/dashboard/Dashboard';
import MainGrid from './components/dashboard/components/MainGrid';
import AnalyticsGrid from './components/dashboard/components/AnalyticsGrid';

export default function App() {
  return (
    <AppTheme>
      <Routes>
        <Route path="/" element={<Dashboard />}>
          {/* These are children of Dashboard */}
          <Route index element={<MainGrid />} />
          <Route path="analytics" element={<AnalyticsGrid />} />
          {/* Add more as needed */}
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AppTheme>
  );
}
