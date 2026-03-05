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
import { SectionIcon } from '../components/common/SectionIcon';

export const AudienceInsights = () => {
  const { data, status } = useDashboard();

  if (status === 'loading' && !data) {
    return (
      <section className="app-content-card">
        <div className="app-content-header">
          <div className="app-content-title-block">
            <SectionIcon name="audience" />
            <div className="app-content-title">Insights de audiencia</div>
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

  const PIE_COLORS = ['#b91c8c', '#111827', '#6b7280'];

  return (
    <section className="app-content-card">
      <header className="app-content-header">
        <div className="app-content-title-block">
          <SectionIcon name="audience" />
          <div className="app-content-title">Insights de audiencia</div>
        </div>
      </header>

      <div className="app-grid">
        <div className="app-grid-half">
          <ChartCard title="Desglose por nacionalidad (datos QR)">
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={audienceInsights.nationalities}>
                <CartesianGrid strokeDasharray="3 3" stroke="#000000" vertical={false} />
                <XAxis dataKey="countryName" stroke="#111827" />
                <YAxis
                  stroke="#111827"
                  tickFormatter={(v) => `${v.toFixed(0)}%`}
                  domain={[0, 'dataMax + 5']}
                />
                <Tooltip
                  contentStyle={{
                    background: '#ffffff',
                    borderRadius: 0,
                    border: '2px solid #000000',
                    fontSize: 12,
                    color: '#111827',
                  }}
                  formatter={(value, _name, { payload }) =>
                    [`${value.toFixed(1)}%`, payload.countryCode]
                  }
                />
                <Bar
                  dataKey="pct"
                  radius={[0, 0, 0, 0]}
                  fill="#b91c8c"
                  maxBarSize={40}
                />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>

        <div className="app-grid-half">
          <ChartCard
            title="Detección de usuarios recurrentes"
            rightMeta={
              <span className="chart-meta-pill">
                Visitantes recurrentes: {audienceInsights.repeatUsers.sharePct}%
              </span>
            }
          >
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Tooltip
                  contentStyle={{
                    background: '#ffffff',
                    borderRadius: 0,
                    border: '2px solid #000000',
                    fontSize: 12,
                    color: '#111827',
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
                  paddingAngle={2}
                >
                  {audienceInsights.repeatUsers.breakdownByVisits.map((entry, index) => (
                    <Cell
                      // eslint-disable-next-line react/no-array-index-key
                      key={index}
                      fill={PIE_COLORS[index] || '#b91c8c'}
                    />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>

        <div className="app-grid-half">
          <ChartCard title="Distribución por edad">
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={audienceInsights.demographics.ageBuckets}>
                <CartesianGrid strokeDasharray="3 3" stroke="#000000" vertical={false} />
                <XAxis dataKey="bucket" stroke="#111827" />
                <YAxis
                  stroke="#111827"
                  tickFormatter={(v) => `${v.toFixed(0)}%`}
                  domain={[0, 'dataMax + 5']}
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
                  dataKey="pct"
                  radius={[0, 0, 0, 0]}
                  fill="#b91c8c"
                  maxBarSize={48}
                />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>

        <div className="app-grid-half">
          <ChartCard title="Distribución por género">
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={audienceInsights.demographics.genderSplit}>
                <CartesianGrid strokeDasharray="3 3" stroke="#000000" vertical={false} />
                <XAxis dataKey="label" stroke="#111827" />
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
                  dataKey="pct"
                  radius={[0, 0, 0, 0]}
                  fill="#111827"
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

