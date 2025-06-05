import React from 'react';
import {Routes,Route,Navigate} from 'react-router-dom';

import AppTheme from './components/shared-theme/AppTheme';
import Dashboard from './components/dashboard/Dashboard';

export default function App() {
  return (
    <AppTheme>
      <Routes>
        {/* Main dashboard page */}
        <Route path="/" element={<Dashboard />} />
        {/* Redirect any unknown paths back to / */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AppTheme>
  );
}