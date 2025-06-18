// src/features/dashboard/components/data/statCardData.ts

import { StatCardProps } from '../../../../components/ui/StatCard';

export const statCardData: StatCardProps[] = [
  {
    title: 'Users',
    value: '14k',
    interval: 'Last 30 days',
    trend: 'up',
    data: [/* chart values */],
  },
  {
    title: 'Conversions',
    value: '325',
    interval: 'Last 30 days',
    trend: 'down',
    data: [/* chart values */],
  },
  {
    title: 'Event count',
    value: '200k',
    interval: 'Last 30 days',
    trend: 'neutral',
    data: [/* chart values */],
  },
];
