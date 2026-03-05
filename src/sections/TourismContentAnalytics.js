import React from 'react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { useDashboard } from '../context/DashboardContext';
import { ChartCard } from '../components/common/ChartCard';
import { SkeletonBlock } from '../components/common/SkeletonBlock';

export const TourismContentAnalytics = () => {
  const { data, status } = useDashboard();

  if (status === 'loading' && !data) {
    return (
      <section className="app-content-card">
        <div className="app-content-header">
          <div className="app-content-title-block">
            <div className="app-content-title">Tourism content analytics</div>
            <div className="app-content-subtitle">
              Performance of destination content across the kiosk experience.
            </div>
          </div>
        </div>
        <SkeletonBlock lines={5} />
      </section>
    );
  }

  if (!data) {
    return null;
  }

  const { tourismContent } = data;

  return (
    <section className="app-content-card">
      <header className="app-content-header">
        <div className="app-content-title-block">
          <div className="app-content-title">Tourism content analytics</div>
          <div className="app-content-subtitle">
            Deep dive into which content resonates most with visitors.
          </div>
        </div>
      </header>

      <div className="app-grid">
        <div className="app-grid-half">
          <ChartCard
            title="Content views by category"
            subtitle="Volume of views across key content groupings."
          >
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={tourismContent.contentViewsByCategory}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
                <XAxis dataKey="category" stroke="#9ca3af" />
                <YAxis stroke="#9ca3af" />
                <Tooltip
                  contentStyle={{
                    background: '#ffffff',
                    borderRadius: 8,
                    border: '1px solid #e5e7eb',
                    fontSize: 12,
                    color: '#111827',
                  }}
                />
                <Bar
                  dataKey="views"
                  radius={[8, 8, 2, 2]}
                  fill="url(#contentViewsGradient)"
                  maxBarSize={56}
                />
                <defs>
                  <linearGradient id="contentViewsGradient" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#38bdf8" />
                    <stop offset="50%" stopColor="#a855f7" />
                    <stop offset="100%" stopColor="#ec4899" />
                  </linearGradient>
                </defs>
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>

        <div className="app-grid-half">
          <ChartCard
            title="Average time on content"
            subtitle="Average time visitors spend per content category."
          >
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={tourismContent.avgTimeOnContent}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
                <XAxis dataKey="category" stroke="#9ca3af" />
                <YAxis
                  stroke="#9ca3af"
                  tickFormatter={(v) => `${v.toFixed(1)} min`}
                  domain={[0, 'dataMax + 1']}
                />
                <Tooltip
                  contentStyle={{
                    background: '#ffffff',
                    borderRadius: 8,
                    border: '1px solid #e5e7eb',
                    fontSize: 12,
                    color: '#111827',
                  }}
                  formatter={(value) => `${value.toFixed(1)} min`}
                />
                <Bar
                  dataKey="minutes"
                  radius={[8, 8, 2, 2]}
                  fill="url(#timeOnContentGradient)"
                  maxBarSize={56}
                />
                <defs>
                  <linearGradient id="timeOnContentGradient" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#22c55e" />
                    <stop offset="50%" stopColor="#a855f7" />
                    <stop offset="100%" stopColor="#ec4899" />
                  </linearGradient>
                </defs>
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>

        <div className="app-grid-full">
          <ChartCard
            title="Engagement actions by category"
            subtitle="Saves and shares as indicators of deeper content interest."
          >
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={tourismContent.interactionsByCategory}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
                <XAxis dataKey="category" stroke="#9ca3af" />
                <YAxis stroke="#9ca3af" />
                <Tooltip
                  contentStyle={{
                    background: '#ffffff',
                    borderRadius: 8,
                    border: '1px solid #e5e7eb',
                    fontSize: 12,
                    color: '#111827',
                  }}
                />
                <Bar
                  dataKey="saves"
                  radius={[8, 8, 2, 2]}
                  fill="#a855f7"
                  maxBarSize={48}
                />
                <Bar
                  dataKey="shares"
                  radius={[8, 8, 2, 2]}
                  fill="#38bdf8"
                  maxBarSize={48}
                />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>
      </div>
    </section>
  );
};

