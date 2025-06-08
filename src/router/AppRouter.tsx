// src/router/AppRouter.tsx
import { Routes, Route, Navigate } from 'react-router-dom';
import ProcessMining from '@/layout/ProcessMiningLayout';
import { DashboardPage } from '@/features/dashboard/pages';
import { SimSettingsPage } from '@/features/sim_settings/pages';
import { ImpactAnalysisPage } from '@/features/impact_analysis/pages';
import { WarehousePage } from '@/features/warehouse/pages';
import { AppSettingsPage } from '@/features/app_settings/pages';

export default function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<ProcessMining />}>
        <Route index element={<DashboardPage />} />
        <Route path="simSetting" element={<SimSettingsPage />} />
        <Route path="warehouse" element={<WarehousePage />} />
        <Route path="impactAnalysis" element={<ImpactAnalysisPage />} />
        <Route path="settings" element={<AppSettingsPage />} />
        <Route path="about" element={<div>About Page</div>} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
