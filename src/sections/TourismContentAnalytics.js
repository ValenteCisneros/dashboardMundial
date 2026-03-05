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
import { SectionIcon } from '../components/common/SectionIcon';

export const TourismContentAnalytics = () => {
  const { data, status } = useDashboard();

  if (status === 'loading' && !data) {
    return (
      <section className="app-content-card">
        <div className="app-content-header">
          <div className="app-content-title-block">
            <SectionIcon name="tourism" />
            <div className="app-content-title">Análisis de contenido turístico</div>
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
          <SectionIcon name="tourism" />
          <div className="app-content-title">Análisis de contenido turístico</div>
        </div>
      </header>

      <div className="app-grid">
        <div className="app-grid-half">
          <ChartCard title="Vistas de contenido por categoría">
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={tourismContent.contentViewsByCategory}>
                <CartesianGrid strokeDasharray="3 3" stroke="#000000" vertical={false} />
                <XAxis dataKey="category" stroke="#111827" />
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
                  dataKey="views"
                  radius={[0, 0, 0, 0]}
                  fill="#b91c8c"
                  maxBarSize={56}
                />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>

        <div className="app-grid-half">
          <ChartCard title="Tiempo promedio en contenido">
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={tourismContent.avgTimeOnContent}>
                <CartesianGrid strokeDasharray="3 3" stroke="#000000" vertical={false} />
                <XAxis dataKey="category" stroke="#111827" />
                <YAxis
                  stroke="#111827"
                  tickFormatter={(v) => `${v.toFixed(1)} min`}
                  domain={[0, 'dataMax + 1']}
                />
                <Tooltip
                  contentStyle={{
                    background: '#ffffff',
                    borderRadius: 0,
                    border: '2px solid #000000',
                    fontSize: 12,
                    color: '#111827',
                  }}
                  formatter={(value) => `${value.toFixed(1)} min`}
                />
                <Bar
                  dataKey="minutes"
                  radius={[0, 0, 0, 0]}
                  fill="#111827"
                  maxBarSize={56}
                />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>

        <div className="app-grid-full">
          <ChartCard title="Acciones de interacción por categoría">
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={tourismContent.interactionsByCategory}>
                <CartesianGrid strokeDasharray="3 3" stroke="#000000" vertical={false} />
                <XAxis dataKey="category" stroke="#111827" />
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
                  dataKey="saves"
                  radius={[0, 0, 0, 0]}
                  fill="#b91c8c"
                  maxBarSize={48}
                />
                <Bar
                  dataKey="shares"
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

