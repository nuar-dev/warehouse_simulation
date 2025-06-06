import { Routes, Route, Navigate } from 'react-router-dom';
import AppTheme from './components/shared-theme/AppTheme';
import Dashboard from './components/dashboard/Dashboard';
import DashboardGrid from './components/dashboard/components/DashboardGrid';
import SimSettingGrid from './components/dashboard/components/SimSettingGrid';
import ImpactAnalysisGrid from './components/dashboard/components/ImpactAnalysisGrid';
import WarehouseGrid from './components/dashboard/components/WarehouseGrid';

export default function App() {
  return (
    <AppTheme>
      <Routes>
        <Route path="/" element={<Dashboard />}>
          <Route index element={<DashboardGrid />} />
          <Route path="simSetting" element={<SimSettingGrid />} />
          <Route path="warehouse" element={<WarehouseGrid />} />
          <Route path="impactAnalysis" element={<ImpactAnalysisGrid />} />
          <Route path="settings" element={<div>Settings Page</div>} />
          <Route path="about" element={<div>About Page</div>} />
          {/* Add more as needed */}
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AppTheme>
  );  
}
