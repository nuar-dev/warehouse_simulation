import { Routes, Route, Navigate } from 'react-router-dom';
import ProcessMiningLayout from '@/layout/ProcessMiningLayout';

import { 
  WarehouseLoader, 
  CustomLayout 
} from '@/features/warehouse/pages';

import { SimSettingsLoader } from '@/features/sim_settings/pages';
import { ImpactAnalysisLoader } from '@/features/impact_analysis/pages';
import { AppSettingsPage } from '@/features/app_settings/pages';
import { DashboardLoader } from '@/features/dashboard/pages';

export default function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<ProcessMiningLayout />}>
        <Route index element={<DashboardLoader />} />

        <Route path="warehouse" element={<WarehouseLoader />} />
        <Route path="warehouse/custom" element={<CustomLayout />} />

        <Route path="simSetting" element={<SimSettingsLoader />} />
        <Route path="impactAnalysis" element={<ImpactAnalysisLoader />} />
        <Route path="settings" element={<AppSettingsPage />} />
        <Route path="about" element={<div>About Page</div>} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
