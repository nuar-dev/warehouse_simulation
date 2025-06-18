import SimSetting from './pages/SimSettings';
import { StatCardProps } from '@/components/ui/StatCard';

const mockData: StatCardProps[] = [
  {
    title: 'Users',
    value: '14k',
    interval: 'Last 30 days',
    trend: 'up',
    data: new Array(30).fill(0).map((_, i) => 200 + i * 10),
  },
  {
    title: 'Conversions',
    value: '325',
    interval: 'Last 30 days',
    trend: 'down',
    data: new Array(30).fill(0).map((_, i) => 1000 - i * 20),
  },
  {
    title: 'Event count',
    value: '200k',
    interval: 'Last 30 days',
    trend: 'neutral',
    data: new Array(30).fill(0).map(() => 500 + Math.floor(Math.random() * 100)),
  },
];

export default function SimSettingLoader() {
  // Later you’ll fetch from Zustand, SWR, etc.
  return <SimSetting statCards={mockData} />;
}
