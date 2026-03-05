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
import { SectionIcon } from '../components/common/SectionIcon';

export const UserBehaviorAnalytics = () => {
  const { data, status } = useDashboard();

  if (status === 'loading' && !data) {
    return (
      <section className="app-content-card">
        <div className="app-content-header">
          <div className="app-content-title-block">
            <SectionIcon name="behavior" />
            <div className="app-content-title">Análisis de comportamiento de usuarios</div>
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
          <SectionIcon name="behavior" />
          <div className="app-content-title">Análisis de comportamiento de usuarios</div>
        </div>
      </header>

      <div className="app-grid">
        <div className="app-grid-half">
          <ChartCard title="Distribución de tiempo de sesión">
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={userBehavior.sessionTimeDistribution}>
                <CartesianGrid strokeDasharray="3 3" stroke="#000000" vertical={false} />
                <XAxis dataKey="bucket" stroke="#111827" />
                <YAxis stroke="#111827" />
                <Tooltip
                  contentStyle={{
                    background: '#ffffff',
                    borderRadius: 0,
                    border: '2px solid #000000',
                    fontSize: 12,
                    color: '#111827',
                  }}
                />
                <Bar
                  dataKey="users"
                  radius={[0, 0, 0, 0]}
                  fill="#b91c8c"
                  maxBarSize={56}
                />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>

        <div className="app-grid-half">
          <ChartCard title="Interacción por hora">
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={userBehavior.engagementPerHour}>
                <CartesianGrid strokeDasharray="3 3" stroke="#000000" vertical={false} />
                <XAxis dataKey="hour" stroke="#111827" />
                <YAxis stroke="#111827" />
                <Tooltip
                  contentStyle={{
                    background: '#ffffff',
                    borderRadius: 0,
                    border: '2px solid #000000',
                    fontSize: 12,
                    color: '#111827',
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="players"
                  stroke="#b91c8c"
                  strokeWidth={2}
                  dot={false}
                />
                <Line
                  type="monotone"
                  dataKey="infoViewers"
                  stroke="#111827"
                  strokeWidth={2}
                  dot={false}
                />
                <Line
                  type="monotone"
                  dataKey="qrEntrants"
                  stroke="#6b7280"
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>

        <div className="app-grid-half">
          <ChartCard
            title="Tasa de completado de datos QR"
            rightMeta={
              <span className="chart-meta-pill">
                Actual: {userBehavior.qrDataCompletionRate.current}%
              </span>
            }
          >
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={userBehavior.qrDataCompletionRate.series}>
                <CartesianGrid strokeDasharray="3 3" stroke="#000000" vertical={false} />
                <XAxis dataKey="label" stroke="#111827" />
                <YAxis
                  stroke="#111827"
                  tickFormatter={(v) => `${v.toFixed(0)}%`}
                  domain={['dataMin - 5', 'dataMax + 5']}
                />
                <Tooltip
                  contentStyle={{
                    background: '#ffffff',
                    borderRadius: 0,
                    border: '2px solid #000000',
                    fontSize: 12,
                    color: '#111827',
                  }}
                  formatter={(value) => `${value.toFixed(1)}%`}
                />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="#b91c8c"
                  strokeWidth={2}
                  dot={{ r: 3 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>

        <div className="app-grid-half">
          <ChartCard title="Volumen de leads e inicios de juego">
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={userBehavior.leadVolumeOverTime}>
                <CartesianGrid strokeDasharray="3 3" stroke="#000000" vertical={false} />
                <XAxis dataKey="label" stroke="#111827" />
                <YAxis stroke="#111827" />
                <Tooltip
                  contentStyle={{
                    background: '#ffffff',
                    borderRadius: 0,
                    border: '2px solid #000000',
                    fontSize: 12,
                    color: '#111827',
                  }}
                />
                <Bar
                  dataKey="leads"
                  radius={[0, 0, 0, 0]}
                  fill="#b91c8c"
                  maxBarSize={48}
                />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>

        <div className="app-grid-full">
          <ChartCard title="Análisis de abandono">
            <div className="dropoff-grid">
              {[
                { key: 'qrFlow', title: 'Flujo de onboarding QR' },
                { key: 'gameFlow', title: 'Flujo del juego' },
                { key: 'infoBrowsing', title: 'Navegación de información turística' },
              ].map((section) => (
                <div key={section.key} className="dropoff-column">
                  <div className="dropoff-title">{section.title}</div>
                  <ResponsiveContainer width="100%" height={160}>
                    <BarChart data={userBehavior.dropOffAnalysis[section.key]}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#000000" vertical={false} />
                      <XAxis dataKey="stage" stroke="#111827" />
                      <YAxis
                        stroke="#111827"
                        tickFormatter={(v) => `${v.toFixed(0)}%`}
                        domain={[0, 100]}
                      />
                      <Tooltip
                        contentStyle={{
                          background: '#ffffff',
                          borderRadius: 0,
                          border: '2px solid #000000',
                          fontSize: 12,
                          color: '#111827',
                        }}
                        formatter={(value) => `${value.toFixed(1)}%`}
                      />
                      <Bar
                        dataKey="completionPct"
                        radius={[0, 0, 0, 0]}
                        fill="#b91c8c"
                        maxBarSize={40}
                      />
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

