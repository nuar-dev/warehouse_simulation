import * as React from 'react';
import Copyright from '../internals/components/Copyright';
import ChartUserByCountry from './ChartUserByCountry';
import CustomizedTreeView from './CustomizedTreeView';
import CustomizedDataGrid from './CustomizedDataGrid';
import HighlightedCard from './HighlightedCard';
import PageViewsBarChart from './PageViewsBarChart';
import SessionsChart from './SessionsChart';
import StatCard, { StatCardProps } from './StatCard';

const data: StatCardProps[] = [
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

export default function AnalyticsGridMock() {
  return (
    <div style={{ maxWidth: '1600px', margin: 'auto', padding: '2rem' }}>
      <header style={{ marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1.75rem', fontWeight: 'bold' }}>📊 Dashboard Summary</h2>
      </header>

      {/* Stat Cards Section */}
      <section
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '1rem',
          marginBottom: '2rem',
        }}
      >
        {data.map((card, index) => (
          <article key={index} style={{ flex: '1 1 20rem', background: '#f0f4f8', padding: '1rem', borderRadius: '12px' }}>
            <StatCard {...card} />
          </article>
        ))}
        <article style={{ flex: '1 1 20rem', background: '#ffe0b2', padding: '1rem', borderRadius: '12px' }}>
          <HighlightedCard />
        </article>
      </section>

      {/* Charts Section */}
      <section
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '1.5rem',
          marginBottom: '2rem',
        }}
      >
        <div style={{ background: '#e3f2fd', padding: '1rem', borderRadius: '12px' }}>
          <SessionsChart />
        </div>
        <div style={{ background: '#e8f5e9', padding: '1rem', borderRadius: '12px' }}>
          <PageViewsBarChart />
        </div>
      </section>

      {/* Details Section */}
      <section style={{ marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1rem' }}>🧾 Data & Insights</h2>
        <div style={{ display: 'flex', flexDirection: 'row', gap: '1.5rem' }}>
          <div style={{ flex: 3, background: '#f9fbe7', padding: '1rem', borderRadius: '12px' }}>
            <CustomizedDataGrid />
          </div>
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ background: '#fff3e0', padding: '1rem', borderRadius: '12px' }}>
              <CustomizedTreeView />
            </div>
            <div style={{ background: '#ede7f6', padding: '1rem', borderRadius: '12px' }}>
              <ChartUserByCountry />
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ marginTop: '4rem', textAlign: 'center' }}>
        <Copyright />
      </footer>
    </div>
  );
}
