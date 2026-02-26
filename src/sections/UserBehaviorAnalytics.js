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

export const UserBehaviorAnalytics = () => {
  const { data, status } = useDashboard();

  if (status === 'loading' && !data) {
    return (
      <section className="app-content-card">
        <div className="app-content-header">
          <div className="app-content-title-block">
            <div className="app-content-title">User behavior analytics</div>
            <div className="app-content-subtitle">
              Session time distribution, interaction patterns, and drop-off behaviour.
            </div>
          </div>
        </div>
        <SkeletonBlock lines={6} />
      </section>
    );
  }

  if (!data) {
    return null;
  }

  const { userBehavior } = data;

  return (
    <section className="app-content-card">
      <header className="app-content-header">
        <div className="app-content-title-block">
          <div className="app-content-title">User behavior analytics</div>
          <div className="app-content-subtitle">
            Detailed analysis of how visitors interact with the kiosk over time.
          </div>
        </div>
      </header>

      <div className="app-grid">
        <div className="app-grid-half">
          <ChartCard
            title="Session time distribution"
            subtitle="How long visitors typically stay engaged in a single session."
          >
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={userBehavior.sessionTimeDistribution}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" vertical={false} />
                <XAxis dataKey="bucket" stroke="#9ca3af" />
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
                  dataKey="users"
                  radius={[8, 8, 2, 2]}
                  fill="url(#sessionDistGradient)"
                  maxBarSize={56}
                />
                <defs>
                  <linearGradient id="sessionDistGradient" x1="0" y1="0" x2="1" y2="1">
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
            title="Engagement per hour"
            subtitle="Game plays, content views, and QR entries over the day."
          >
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={userBehavior.engagementPerHour}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" vertical={false} />
                <XAxis dataKey="hour" stroke="#9ca3af" />
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
                  dataKey="players"
                  stroke="#a855f7"
                  strokeWidth={2.1}
                  dot={false}
                />
                <Line
                  type="monotone"
                  dataKey="infoViewers"
                  stroke="#38bdf8"
                  strokeWidth={2.1}
                  dot={false}
                />
                <Line
                  type="monotone"
                  dataKey="qrEntrants"
                  stroke="#22c55e"
                  strokeWidth={2.1}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>

        <div className="app-grid-half">
          <ChartCard
            title="QR data completion rate"
            subtitle="Completion of QR data capture forms over time."
            rightMeta={
              <span className="chart-meta-pill">
                Current: {userBehavior.qrDataCompletionRate.current}% (vs{' '}
                {userBehavior.qrDataCompletionRate.previous}%)
              </span>
            }
          >
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={userBehavior.qrDataCompletionRate.series}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" vertical={false} />
                <XAxis dataKey="label" stroke="#9ca3af" />
                <YAxis
                  stroke="#9ca3af"
                  tickFormatter={(v) => `${v.toFixed(0)}%`}
                  domain={['dataMin - 5', 'dataMax + 5']}
                />
                <Tooltip
                  contentStyle={{
                    background: '#020617',
                    borderRadius: 12,
                    border: '1px solid rgba(148,163,184,0.7)',
                    fontSize: 12,
                  }}
                  formatter={(value) => `${value.toFixed(1)}%`}
                />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="#22c55e"
                  strokeWidth={2.3}
                  dot={{ r: 3 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>

        <div className="app-grid-half">
          <ChartCard
            title="Lead volume and game starts"
            subtitle="Lead capture volume and game initiations across the period."
          >
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={userBehavior.leadVolumeOverTime}>
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
                  dataKey="leads"
                  radius={[8, 8, 2, 2]}
                  fill="url(#leadVolumeGradient)"
                  maxBarSize={48}
                />
                <defs>
                  <linearGradient id="leadVolumeGradient" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#a855f7" />
                    <stop offset="100%" stopColor="#ec4899" />
                  </linearGradient>
                </defs>
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>

        <div className="app-grid-full">
          <ChartCard
            title="Drop-off analysis"
            subtitle="Completion rates along the main user journeys."
          >
            <div className="dropoff-grid">
              {[
                { key: 'qrFlow', title: 'QR onboarding flow' },
                { key: 'gameFlow', title: 'Game flow' },
                { key: 'infoBrowsing', title: 'Tourism information browsing' },
              ].map((section) => (
                <div key={section.key} className="dropoff-column">
                  <div className="dropoff-title">{section.title}</div>
                  <ResponsiveContainer width="100%" height={160}>
                    <BarChart data={userBehavior.dropOffAnalysis[section.key]}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" vertical={false} />
                      <XAxis dataKey="stage" stroke="#9ca3af" />
                      <YAxis
                        stroke="#9ca3af"
                        tickFormatter={(v) => `${v.toFixed(0)}%`}
                        domain={[0, 100]}
                      />
                      <Tooltip
                        contentStyle={{
                          background: '#020617',
                          borderRadius: 12,
                          border: '1px solid rgba(148,163,184,0.7)',
                          fontSize: 12,
                        }}
                        formatter={(value) => `${value.toFixed(1)}%`}
                      />
                      <Bar
                        dataKey="completionPct"
                        radius={[8, 8, 2, 2]}
                        fill="url(#dropoffGradient)"
                        maxBarSize={40}
                      />
                      <defs>
                        <linearGradient id="dropoffGradient" x1="0" y1="0" x2="1" y2="1">
                          <stop offset="0%" stopColor="#22c55e" />
                          <stop offset="50%" stopColor="#eab308" />
                          <stop offset="100%" stopColor="#ef4444" />
                        </linearGradient>
                      </defs>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              ))}
            </div>
          </ChartCard>
        </div>
      </div>
    </section>
  );
};

