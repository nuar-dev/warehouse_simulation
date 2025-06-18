// React Router core imports
import { Routes, Route, Navigate } from 'react-router-dom';

// Global layout wrapping all routes (sidebar, header, etc.)
import ProcessMiningLayout from '@/layout/ProcessMiningLayout';

/*
  ────────────────────────────────────────────────────────────────────────────────
  Dynamic Feature Routes (with logic or data loading via Loader components)
  These routes are composed of a logic-handling loader (context, state, etc.)
  and a separate UI component for rendering. This pattern allows future scalability.
  ────────────────────────────────────────────────────────────────────────────────
*/

// Warehouse feature: layout loading, configuration, and simulation canvas
import {
  WarehouseLoader,     // entry route for warehouse overview and layout logic
  CustomLayout         // custom layout editor at /warehouse/custom
} from '@/features/warehouse/pages';
// TODO: Add layout validation (e.g., warn if grid is misaligned or incomplete).
// TODO: Add support for saving/loading user-defined layouts from localStorage or backend.
// TODO: Integrate zone-based simulation overlays (pick zones, VAS, etc.).
// TODO: 💡 Convert WarehouseLoader and CustomLayout to lazy-loaded components.
// TODO: 🔐 Optionally protect warehouse routes with role-based auth (e.g., admin only).

// Dashboard: summary charts and metrics
import { DashboardLoader } from '@/features/dashboard/pages';
// TODO: Replace static `statCardData` with live API or context-based metrics.
// TODO: Add filters (e.g., by date, simulation run) for dynamic dashboards.
// TODO: 💡 Lazy-load DashboardLoader for improved startup performance.

// Sim Settings: simulation parameters, charts, overview (static for now)
import { SimSettingsLoader } from '@/features/sim_settings/pages';
// TODO: Connect to shared simulation state (e.g., global config context).
// TODO: Replace hardcoded chart data with Zustand or backend-driven values.
// TODO: Allow editing of parameters via forms, persist across reloads.
// TODO: 💡 Consider lazy-loading SimSettingsLoader.
// TODO: 🔐 Wrap in ProtectedRoute to prevent unauthorized access.

// Impact Analysis: dynamic evaluation views and interaction (future interactive)
import { ImpactAnalysisLoader } from '@/features/impact_analysis/pages';
// TODO: Implement guided scenario comparisons (e.g., A vs. B with outcome analysis).
// TODO: Add global simulation state reactions (e.g., change here affects warehouse).
// TODO: Introduce "impact scoring models" and let users configure thresholds.
// TODO: 💡 Lazy-load ImpactAnalysisLoader once interactivity increases.
// TODO: 🔐 Protect this route when interactive actions are tied to app state.

/*
  ────────────────────────────────────────────────────────────────────────────────
  Static Feature Routes (presentational pages without logic or data loading)
  These are typically UI-only, not requiring loaders or layout setup logic.
  ────────────────────────────────────────────────────────────────────────────────
*/

// Application settings (form-based, no business logic)
import { AppSettings } from '@/features/app_settings/pages';
// TODO: Add form validation (e.g., toggle theme, default layout preferences).
// TODO: Store preferences using context or Tauri settings storage.
// TODO: 💡 Consider lazy-loading AppSettings if it grows in complexity.

// About screen (static content)
import { About } from '@/features/about/pages';
// TODO: Add project version, GitHub repo link, contributors, license info.
// TODO: 💡 Convert About to lazy component for performance if image/media added.


// ────────────────────────────────────────────────────────────────────────────────
// Main Router Configuration
// ────────────────────────────────────────────────────────────────────────────────
export default function AppRouter() {
  return (
    <Routes>
      {/* Wrap all feature routes in the main layout (sidebar, header, etc.) */}
      <Route path="/" element={<ProcessMiningLayout />}>

        {/* Index route: default entry dashboard */}
        <Route index element={<DashboardLoader />} />

        {/* Warehouse views */}
        <Route path="warehouse" element={<WarehouseLoader />} />
        <Route path="warehouse/custom" element={<CustomLayout />} />

        {/* Simulation configuration screen */}
        <Route path="simSetting" element={<SimSettingsLoader />} />

        {/* Impact analysis and simulation exploration */}
        <Route path="impactAnalysis" element={<ImpactAnalysisLoader />} />

        {/* Static app-level routes */}
        <Route path="settings" element={<AppSettings />} />
        <Route path="about" element={<About />} />

      </Route>

      {/* Catch-all route fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
