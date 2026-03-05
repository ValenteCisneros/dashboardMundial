import React from 'react';
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { useDashboard } from '../context/DashboardContext';
import { KpiCard } from '../components/common/KpiCard';
import { ChartCard } from '../components/common/ChartCard';
import { SkeletonBlock } from '../components/common/SkeletonBlock';

export const ExecutiveOverview = () => {
  const { data, status } = useDashboard();

  if (status === 'loading' && !data) {
    return (
      <section className="app-content-card">
        <div className="app-content-header">
          <div className="app-content-title-block">
            <div className="app-content-title">Executive overview</div>
            <div className="app-content-subtitle">
              High-level performance view across engagement, conversion, and tourism content.
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

  const {
    averageSessionTime,
    qrEntryRate,
    qrConversionRate,
    churnRateDuringGame,
    detectedUsersBreakdown,
  } = data.executiveOverview.kpis;

  const funnelStages = data.executiveOverview.conversionFunnel.stages;

  return (
    <section className="app-content-card">
      <header className="app-content-header">
        <div className="app-content-title-block">
          <div className="app-content-title">Executive overview</div>
          <div className="app-content-subtitle">
            Summary of core performance indicators for the tourism kiosk programme.
          </div>
        </div>
      </header>

      <div className="app-kpi-row">
        <KpiCard
          label="Average session time"
          value={averageSessionTime.current}
          previous={averageSessionTime.previous}
          changePct={averageSessionTime.changePct}
          trend={averageSessionTime.trend}
          unit={averageSessionTime.unit}
          emphasis="primary"
          footer="Represents time spent across both game and content browsing experiences."
        />
        <KpiCard
          label="QR entry rate"
          value={qrEntryRate.current}
          previous={qrEntryRate.previous}
          changePct={qrEntryRate.current - qrEntryRate.previous}
          trend={qrEntryRate.trend}
          unit={qrEntryRate.unit}
          emphasis="secondary"
          footer="Share of detected users that opt into the QR journey."
        />
        <KpiCard
          label="QR conversion rate"
          value={qrConversionRate.current}
          previous={qrConversionRate.previous}
          changePct={qrConversionRate.current - qrConversionRate.previous}
          trend={qrConversionRate.trend}
          unit={qrConversionRate.unit}
          emphasis="secondary"
          footer="Conversion within the QR flow to valid, contactable leads."
        />
        <KpiCard
          label="Churn during game"
          value={churnRateDuringGame.current}
          previous={churnRateDuringGame.previous}
          changePct={churnRateDuringGame.previous - churnRateDuringGame.current}
          trend={churnRateDuringGame.trend}
          unit={churnRateDuringGame.unit}
          emphasis="alert"
          footer="Share of users who abandon the game before completion."
        />
      </div>

      <div className="app-grid">
        <div className="app-grid-half">
          <ChartCard
            title="Engagement over time"
            subtitle="Average session time and engagement volume across the selected period."
          >
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={averageSessionTime.series}>
                <defs>
                  <linearGradient id="gradientSession" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#a855f7" stopOpacity={0.9} />
                    <stop offset="95%" stopColor="#f9fafb" stopOpacity={0.15} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
                <XAxis dataKey="label" stroke="#6b7280" />
                <YAxis stroke="#6b7280" />
                <Tooltip
                  contentStyle={{
                    background: '#ffffff',
                    borderRadius: 8,
                    border: '1px solid #e5e7eb',
                    fontSize: 12,
                    color: '#111827',
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="minutes"
                  stroke="#a855f7"
                  strokeWidth={2.2}
                  fill="url(#gradientSession)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>

        <div className="app-grid-half">
          <ChartCard
            title="QR conversion funnel"
            subtitle="Progression from detected users through QR entry to qualified leads."
          >
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={funnelStages}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
                <XAxis dataKey="label" stroke="#6b7280" />
                <YAxis stroke="#6b7280" />
                <Tooltip
                  contentStyle={{
                    background: '#ffffff',
                    borderRadius: 8,
                    border: '1px solid #e5e7eb',
                    fontSize: 12,
                    color: '#111827',
                  }}
                  formatter={(value) => value.toLocaleString()}
                />
                <Bar
                  dataKey="value"
                  radius={[8, 8, 2, 2]}
                  fill="url(#funnelGradient)"
                  maxBarSize={64}
                />
                <defs>
                  <linearGradient id="funnelGradient" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#22c55e" />
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
            title="Detected users vs engagement"
            subtitle="Proportion of detected users that play, browse information, or do both."
          >
            <ResponsiveContainer width="100%" height={220}>
              <BarChart
                data={[
                  {
                    label: 'Players',
                    value: detectedUsersBreakdown.ratios.detectedVsPlayersPct,
                  },
                  {
                    label: 'Information viewers',
                    value: detectedUsersBreakdown.ratios.detectedVsInfoViewersPct,
                  },
                  {
                    label: 'Both play and view',
                    value: detectedUsersBreakdown.ratios.detectedVsBothPlayAndViewPct,
                  },
                ]}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
                <XAxis dataKey="label" stroke="#6b7280" />
                <YAxis stroke="#6b7280" tickFormatter={(v) => `${v}%`} />
                <Tooltip
                  contentStyle={{
                    background: '#ffffff',
                    borderRadius: 8,
                    border: '1px solid #e5e7eb',
                    fontSize: 12,
                    color: '#111827',
                  }}
                  formatter={(value) => `${value.toFixed(1)}%`}
                />
                <Bar
                  dataKey="value"
                  radius={[8, 8, 2, 2]}
                  fill="url(#detectedGradient)"
                  maxBarSize={54}
                />
                <defs>
                  <linearGradient id="detectedGradient" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#22c55e" />
                    <stop offset="35%" stopColor="#38bdf8" />
                    <stop offset="100%" stopColor="#a855f7" />
                  </linearGradient>
                </defs>
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>

        <div className="app-grid-half">
          <ChartCard
            title="Nationalities distribution (QR data)"
            subtitle="Composition of visitors based on QR-sourced nationality information."
          >
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={data.executiveOverview.kpis.nationalitiesDistribution}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
                <XAxis dataKey="countryCode" stroke="#6b7280" />
                <YAxis
                  stroke="#6b7280"
                  tickFormatter={(v) => `${v.toFixed(0)}%`}
                  domain={[0, 'dataMax + 5']}
                />
                <Tooltip
                  contentStyle={{
                    background: '#ffffff',
                    borderRadius: 8,
                    border: '1px solid #e5e7eb',
                    fontSize: 12,
                    color: '#111827',
                  }}
                  formatter={(value, _name, { payload }) =>
                    [`${value.toFixed(1)}%`, payload.countryName]
                  }
                />
                <Bar
                  dataKey="pct"
                  radius={[8, 8, 2, 2]}
                  fill="url(#nationalityGradient)"
                  maxBarSize={40}
                />
                <defs>
                  <linearGradient id="nationalityGradient" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#38bdf8" />
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

