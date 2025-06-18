import React from 'react';
import Dashboard from './pages/Dashboard.tsx';
import { statCardData } from './components/data/statCardData.tsx';

export default function DashboardLoader() {
  return <Dashboard statCards={statCardData} />;
}
