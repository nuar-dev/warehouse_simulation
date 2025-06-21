// src/router/AppRouter.tsx

// NO import of BrowserRouter or HashRouter here!
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import ProcessMiningLayout from '@/layout/ProcessMiningLayout';
import { DashboardLoader } from '@/features/dashboard/pages';
import { WarehouseLoader, CustomLayout } from '@/features/warehouse/pages';
import { SimSettingsLoader } from '@/features/sim_settings/pages';
import { ImpactAnalysisLoader } from '@/features/impact_analysis/pages';
import { AppSettings } from '@/features/app_settings/pages';
import { About } from '@/features/about/pages';

export default function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<ProcessMiningLayout />}>
        <Route index element={<DashboardLoader />} />
        <Route path="warehouse" element={<WarehouseLoader />} />
        <Route path="warehouse/custom" element={<CustomLayout />} />
        <Route path="simSetting" element={<SimSettingsLoader />} />
        <Route path="impactAnalysis" element={<ImpactAnalysisLoader />} />
        <Route path="settings" element={<AppSettings />} />
        <Route path="about" element={<About />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
