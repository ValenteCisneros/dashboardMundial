import React from 'react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { useDashboard } from '../context/DashboardContext';
import { ChartCard } from '../components/common/ChartCard';
import { SkeletonBlock } from '../components/common/SkeletonBlock';

export const MarketingImpact = () => {
  const { data, status } = useDashboard();

  if (status === 'loading' && !data) {
    return (
      <section className="app-content-card">
        <div className="app-content-header">
          <div className="app-content-title-block">
            <div className="app-content-title">Marketing impact</div>
            <div className="app-content-subtitle">
              Leads, exports, and attribution across channels.
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

  const { marketingImpact } = data;

  return (
    <section className="app-content-card">
      <header className="app-content-header">
        <div className="app-content-title-block">
          <div className="app-content-title">Marketing impact</div>
          <div className="app-content-subtitle">
            How kiosk engagement converts into qualified leads and campaign value.
          </div>
        </div>
      </header>

      <div className="app-grid">
        <div className="app-grid-half">
          <ChartCard
            title="Lead acquisition over time"
            subtitle="Lead volume captured through QR flows."
            rightMeta={
              <span className="chart-meta-pill">
                {marketingImpact.leadsAcquired.current.toLocaleString()} leads (Δ{' '}
                {marketingImpact.leadsAcquired.changePct}%)
              </span>
            }
          >
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={marketingImpact.leadsAcquired.series}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" vertical={false} />
                <XAxis dataKey="label" stroke="#9ca3af" />
                <YAxis stroke="#9ca3af" />
                <Tooltip
                  contentStyle={{
                    background: '#020617',
                    borderRadius: 12,
                    border: '1px solid rgba(148,163,184,0.7)',
                    fontSize: 12,
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="leads"
                  stroke="#a855f7"
                  strokeWidth={2.3}
                  dot={{ r: 3 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>

        <div className="app-grid-half">
          <ChartCard
            title="Analytics exports"
            subtitle="Operational usage of dashboard exports for reporting."
          >
            <ResponsiveContainer width="100%" height={220}>
              <BarChart
                data={[
                  { label: 'PDF exports', value: marketingImpact.exports.pdfExportsCount },
                  { label: 'CSV exports', value: marketingImpact.exports.csvExportsCount },
                ]}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" vertical={false} />
                <XAxis dataKey="label" stroke="#9ca3af" />
                <YAxis stroke="#9ca3af" />
                <Tooltip
                  contentStyle={{
                    background: '#020617',
                    borderRadius: 12,
                    border: '1px solid rgba(148,163,184,0.7)',
                    fontSize: 12,
                  }}
                />
                <Bar
                  dataKey="value"
                  radius={[8, 8, 2, 2]}
                  fill="url(#exportsGradient)"
                  maxBarSize={56}
                />
                <defs>
                  <linearGradient id="exportsGradient" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#38bdf8" />
                    <stop offset="100%" stopColor="#a855f7" />
                  </linearGradient>
                </defs>
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>

        <div className="app-grid-full">
          <ChartCard
            title="Channel attribution"
            subtitle="Leads attributed to on-site and partner marketing channels."
          >
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={marketingImpact.campaignAttribution}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" vertical={false} />
                <XAxis dataKey="channel" stroke="#9ca3af" />
                <YAxis stroke="#9ca3af" />
                <Tooltip
                  contentStyle={{
                    background: '#020617',
                    borderRadius: 12,
                    border: '1px solid rgba(148,163,184,0.7)',
                    fontSize: 12,
                  }}
                  formatter={(value) => value.toLocaleString()}
                />
                <Bar
                  dataKey="leads"
                  radius={[8, 8, 2, 2]}
                  fill="url(#attributionGradient)"
                  maxBarSize={64}
                />
                <defs>
                  <linearGradient id="attributionGradient" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#22c55e" />
                    <stop offset="50%" stopColor="#a855f7" />
                    <stop offset="100%" stopColor="#ec4899" />
                  </linearGradient>
                </defs>
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>
      </div>
    </section>
  );
};

