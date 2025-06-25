// src/router/AppRouter.tsx

import React, { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

import ProcessMiningLayout from '@/layout/ProcessMiningLayout';
import { DashboardLoader } from '@/features/dashboard/pages';
import { SimSettingsLoader } from '@/features/sim_settings/pages';
import { ImpactAnalysisLoader } from '@/features/impact_analysis/pages';
import { AppSettings } from '@/features/app_settings/pages';
import { About } from '@/features/about/pages';

// Lazy‐load the warehouse feature
const WarehouseLoader = lazy(() =>
  import('@/features/warehouse/pages').then((mod) => ({ default: mod.WarehouseLoader }))
);
const CustomLayout = lazy(() =>
  import('@/features/warehouse/pages').then((mod) => ({ default: mod.CustomLayout }))
);

export default function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<ProcessMiningLayout />}>
        <Route index element={<DashboardLoader />} />

        {/* Warehouse routes are now code-split */}
        <Route
          path="warehouse"
          element={
            <Suspense fallback={<div>Loading warehouse…</div>}>
              <WarehouseLoader />
            </Suspense>
          }
        />
        <Route
          path="warehouse/custom"
          element={
            <Suspense fallback={<div>Loading custom warehouse…</div>}>
              <CustomLayout />
            </Suspense>
          }
        />

        <Route path="simSetting" element={<SimSettingsLoader />} />
        <Route path="impactAnalysis" element={<ImpactAnalysisLoader />} />
        <Route path="settings" element={<AppSettings />} />
        <Route path="about" element={<About />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
