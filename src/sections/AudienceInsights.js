import React from 'react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  Cell,
} from 'recharts';
import { useDashboard } from '../context/DashboardContext';
import { ChartCard } from '../components/common/ChartCard';
import { SkeletonBlock } from '../components/common/SkeletonBlock';

export const AudienceInsights = () => {
  const { data, status } = useDashboard();

  if (status === 'loading' && !data) {
    return (
      <section className="app-content-card">
        <div className="app-content-header">
          <div className="app-content-title-block">
            <div className="app-content-title">Audience insights</div>
            <div className="app-content-subtitle">
              Composition of visitors, repeat usage, and demographic-ready structures.
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

  const { audienceInsights } = data;

  return (
    <section className="app-content-card">
      <header className="app-content-header">
        <div className="app-content-title-block">
          <div className="app-content-title">Audience insights</div>
          <div className="app-content-subtitle">
            Who is engaging with the kiosk, and how frequently they return.
          </div>
        </div>
      </header>

      <div className="app-grid">
        <div className="app-grid-half">
          <ChartCard
            title="Nationalities breakdown (QR data)"
            subtitle="Top nationalities represented among QR-identified visitors."
          >
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={audienceInsights.nationalities}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" vertical={false} />
                <XAxis dataKey="countryName" stroke="#9ca3af" />
                <YAxis
                  stroke="#9ca3af"
                  tickFormatter={(v) => `${v.toFixed(0)}%`}
                  domain={[0, 'dataMax + 5']}
                />
                <Tooltip
                  contentStyle={{
                    background: '#020617',
                    borderRadius: 12,
                    border: '1px solid rgba(148,163,184,0.7)',
                    fontSize: 12,
                  }}
                  formatter={(value, _name, { payload }) =>
                    [`${value.toFixed(1)}%`, payload.countryCode]
                  }
                />
                <Bar
                  dataKey="pct"
                  radius={[8, 8, 2, 2]}
                  fill="url(#audienceNationalityGradient)"
                  maxBarSize={40}
                />
                <defs>
                  <linearGradient id="audienceNationalityGradient" x1="0" y1="0" x2="1" y2="1">
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
            title="Repeat user detection"
            subtitle="Share of visitors returning for multiple sessions."
            rightMeta={
              <span className="chart-meta-pill">
                Repeat visitors: {audienceInsights.repeatUsers.sharePct}%
              </span>
            }
          >
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Tooltip
                  contentStyle={{
                    background: '#020617',
                    borderRadius: 12,
                    border: '1px solid rgba(148,163,184,0.7)',
                    fontSize: 12,
                  }}
                  formatter={(value, name) => [`${value}%`, name]}
                />
                <Pie
                  data={audienceInsights.repeatUsers.breakdownByVisits}
                  dataKey="pct"
                  nameKey="label"
                  cx="50%"
                  cy="50%"
                  innerRadius={48}
                  outerRadius={76}
                  paddingAngle={3}
                >
                  {audienceInsights.repeatUsers.breakdownByVisits.map((entry, index) => (
                    <Cell
                      // eslint-disable-next-line react/no-array-index-key
                      key={index}
                      fill={['#a855f7', '#38bdf8', '#22c55e'][index] || '#ec4899'}
                    />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>

        <div className="app-grid-half">
          <ChartCard
            title="Age distribution (structure-ready)"
            subtitle="Age buckets as a structural placeholder for demographic enrichment."
          >
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={audienceInsights.demographics.ageBuckets}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" vertical={false} />
                <XAxis dataKey="bucket" stroke="#9ca3af" />
                <YAxis
                  stroke="#9ca3af"
                  tickFormatter={(v) => `${v.toFixed(0)}%`}
                  domain={[0, 'dataMax + 5']}
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
                  dataKey="pct"
                  radius={[8, 8, 2, 2]}
                  fill="url(#audienceAgeGradient)"
                  maxBarSize={48}
                />
                <defs>
                  <linearGradient id="audienceAgeGradient" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#a855f7" />
                    <stop offset="100%" stopColor="#ec4899" />
                  </linearGradient>
                </defs>
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>

        <div className="app-grid-half">
          <ChartCard
            title="Gender split (structure-ready)"
            subtitle="High-level structure for gender-based segmentation once data is available."
          >
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={audienceInsights.demographics.genderSplit}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" vertical={false} />
                <XAxis dataKey="label" stroke="#9ca3af" />
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
                  dataKey="pct"
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

