import React, { useMemo, useState } from 'react';
import {
  Bar,
  BarChart,
  Cell,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { useDashboard } from '../context/DashboardContext';
import { ChartCard } from '../components/common/ChartCard';
import { SkeletonBlock } from '../components/common/SkeletonBlock';
import { SectionIcon } from '../components/common/SectionIcon';

const TOOLTIP_STYLE = {
  contentStyle: {
    background: '#ffffff',
    borderRadius: 0,
    border: '2px solid #000000',
    fontSize: 12,
    color: '#111827',
  },
};

const DONUT_COLORS = ['#b91c8c', '#111827', '#6b7280', '#374151', '#9ca3af'];

/** Format number as Mexican Pesos: MXN $ with thousands separators and two decimals. */
function formatMxn(value) {
  if (value == null || Number.isNaN(Number(value))) return '—';
  return `MXN $${Number(value).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

function SortableTable({ columns, data, defaultSortKey, className }) {
  const [sortKey, setSortKey] = useState(defaultSortKey || columns[0].key);
  const [sortDir, setSortDir] = useState('desc');

  const sortedData = useMemo(() => {
    const col = columns.find((c) => c.key === sortKey);
    if (!col || !col.sortable) return data;
    return [...data].sort((a, b) => {
      const aVal = a[sortKey];
      const bVal = b[sortKey];
      const cmp = typeof aVal === 'number' && typeof bVal === 'number' ? aVal - bVal : String(aVal).localeCompare(String(bVal));
      return sortDir === 'asc' ? cmp : -cmp;
    });
  }, [data, sortKey, sortDir, columns]);

  const handleHeaderClick = (key) => {
    const col = columns.find((c) => c.key === key);
    if (!col?.sortable) return;
    if (sortKey === key) setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    else {
      setSortKey(key);
      setSortDir('desc');
    }
  };

  return (
    <div className={className}>
      <table className="ad-table">
        <thead>
          <tr>
            {columns.map((col) => (
              <th
                key={col.key}
                className={col.sortable ? 'ad-table-th--sortable' : ''}
                onClick={() => col.sortable && handleHeaderClick(col.key)}
              >
                {col.label}
                {col.sortable && sortKey === col.key && (
                  <span className="ad-table-sort">{sortDir === 'asc' ? ' \u2191' : ' \u2193'}</span>
                )}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {sortedData.map((row, idx) => (
            <tr key={idx}>
              {columns.map((col) => (
                <td key={col.key}>
                  {col.format ? col.format(row[col.key], row) : row[col.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export const MarketingImpact = () => {
  const { data, status } = useDashboard();
  const [advertiserFilter, setAdvertiserFilter] = useState('all');
  const [locationFilter, setLocationFilter] = useState('all');
  const [timeSlotFilter, setTimeSlotFilter] = useState('all');

  if (status === 'loading' && !data) {
    return (
      <section className="app-content-card ad-section">
        <div className="app-content-header">
          <div className="app-content-title-block">
            <SectionIcon name="marketing" />
            <div className="app-content-title">Impacto en marketing</div>
          </div>
        </div>
        <SkeletonBlock lines={6} />
      </section>
    );
  }

  if (!data?.marketingImpact) {
    return null;
  }

  const ad = data.marketingImpact;
  const summary = ad.executiveSummary;
  const filters = ad.filterOptions;

  return (
    <section className="app-content-card ad-section">
      <header className="app-content-header ad-section-header">
        <div className="app-content-title-block">
          <SectionIcon name="marketing" />
          <div className="app-content-title">Impacto en marketing</div>
        </div>
      </header>

      <div className="ad-executive-block">
        <h3 className="ad-block-title">Resumen</h3>
        <div className="ad-health-badge" data-health={summary.health}>
          {summary.health}
        </div>
      </div>

      <div className="ad-filters">
        <div className="ad-filter-group">
          <label className="ad-filter-label">Anunciante</label>
          <select
            className="ad-filter-select"
            value={advertiserFilter}
            onChange={(e) => setAdvertiserFilter(e.target.value)}
          >
            <option value="all">Todos los anunciantes</option>
            {filters.advertisers.map((a) => (
              <option key={a.value} value={a.value}>{a.label}</option>
            ))}
          </select>
        </div>
        <div className="ad-filter-group">
          <label className="ad-filter-label">Ubicación</label>
          <select
            className="ad-filter-select"
            value={locationFilter}
            onChange={(e) => setLocationFilter(e.target.value)}
          >
            {filters.locations.map((l) => (
              <option key={l.value} value={l.value}>{l.label}</option>
            ))}
          </select>
        </div>
        <div className="ad-filter-group">
          <label className="ad-filter-label">Franja horaria</label>
          <select
            className="ad-filter-select"
            value={timeSlotFilter}
            onChange={(e) => setTimeSlotFilter(e.target.value)}
          >
            {filters.timeSlots.map((t) => (
              <option key={t.value} value={t.value}>{t.label}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="ad-kpi-summary">
        <div className="ad-kpi-tile ad-kpi-tile--primary">
          <div className="ad-kpi-tile-label">Impresiones totales</div>
          <div className="ad-kpi-tile-value">{ad.totalImpressionsSum?.toLocaleString() ?? '—'}</div>
        </div>
        <div className="ad-kpi-tile">
          <div className="ad-kpi-tile-label">Frecuencia promedio por usuario</div>
          <div className="ad-kpi-tile-value">{ad.averageFrequencyPerUser?.value ?? '—'}</div>
          <div className="ad-kpi-tile-meta">vs {ad.averageFrequencyPerUser?.previous} anterior</div>
        </div>
        <div className="ad-kpi-tile">
          <div className="ad-kpi-tile-label">Alcance diario est.</div>
          <div className="ad-kpi-tile-value">{ad.estimatedDailyReach?.value?.toLocaleString() ?? '—'}</div>
          <div className="ad-kpi-tile-meta">usuarios únicos</div>
        </div>
        <div className="ad-kpi-tile">
          <div className="ad-kpi-tile-label">CPM est.</div>
          <div className="ad-kpi-tile-value">{formatMxn(ad.estimatedCPM?.value)}</div>
        </div>
        <div className="ad-kpi-tile">
          <div className="ad-kpi-tile-label">CTR</div>
          <div className="ad-kpi-tile-value">{ad.ctr?.value != null ? `${ad.ctr.value}%` : '—'}</div>
          <div className="ad-kpi-tile-meta">landing de registro</div>
        </div>
        <div className="ad-kpi-tile">
          <div className="ad-kpi-tile-label">Ingresos por clic</div>
          <div className="ad-kpi-tile-value">{formatMxn(ad.revenuePerClick?.value)}</div>
        </div>
        <div className="ad-kpi-tile">
          <div className="ad-kpi-tile-label">Ingresos por lead</div>
          <div className="ad-kpi-tile-value">{formatMxn(ad.revenuePerLead?.value)}</div>
        </div>
      </div>

      <div className="ad-block">
        <ChartCard title="Impresiones totales por anuncio">
          <div className="ad-chart-row">
            <ResponsiveContainer width="100%" height={280}>
              <BarChart
                data={ad.totalImpressionsPerAd || []}
                layout="vertical"
                margin={{ left: 8, right: 24 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#000000" horizontal={false} />
                <XAxis type="number" stroke="#111827" tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`} />
                <YAxis type="category" dataKey="adName" width={140} stroke="#111827" tick={{ fontSize: 11 }} />
                <Tooltip {...TOOLTIP_STYLE} formatter={(v) => v.toLocaleString()} />
                <Bar dataKey="impressions" fill="#b91c8c" radius={[0, 0, 0, 0]} maxBarSize={28} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>
      </div>

      <div className="ad-grid-2">
        <ChartCard
          title="Frecuencia promedio por usuario"
          rightMeta={<span className="chart-meta-pill">{ad.averageFrequencyPerUser?.value} prom.</span>}
        >
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={ad.averageFrequencyPerUser?.distribution || []}>
              <CartesianGrid strokeDasharray="3 3" stroke="#000000" vertical={false} />
              <XAxis dataKey="bucket" stroke="#111827" />
              <YAxis stroke="#111827" />
              <Tooltip {...TOOLTIP_STYLE} />
              <Bar dataKey="users" fill="#b91c8c" radius={[0, 0, 0, 0]} maxBarSize={48} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Tiempo promedio de exposición por anuncio">
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={ad.averageExposureTimePerAd || []}>
              <CartesianGrid strokeDasharray="3 3" stroke="#000000" vertical={false} />
              <XAxis dataKey="advertiser" stroke="#111827" tick={{ fontSize: 10 }} />
              <YAxis stroke="#111827" tickFormatter={(v) => `${v}s`} />
              <Tooltip {...TOOLTIP_STYLE} formatter={(v) => `${v} s`} />
              <Bar dataKey="seconds" fill="#111827" radius={[0, 0, 0, 0]} maxBarSize={40} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      <div className="ad-block">
        <ChartCard
          title="Alcance diario estimado"
          rightMeta={
            <span className="chart-meta-pill">
              {ad.estimatedDailyReach?.value?.toLocaleString()} prom.
            </span>
          }
        >
          <ResponsiveContainer width="100%" height={240}>
            <LineChart data={ad.estimatedDailyReach?.dailyTrend || []}>
              <CartesianGrid strokeDasharray="3 3" stroke="#000000" vertical={false} />
              <XAxis dataKey="date" stroke="#111827" />
              <YAxis stroke="#111827" />
              <Tooltip {...TOOLTIP_STYLE} />
              <Line type="monotone" dataKey="reach" stroke="#b91c8c" strokeWidth={2} dot={{ r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      <div className="ad-block">
        <ChartCard title="Impresiones por franja horaria">
          <div className="ad-heatmap-wrap">
            <div className="ad-heatmap">
              <div className="ad-heatmap-row ad-heatmap-header">
                <div className="ad-heatmap-cell ad-heatmap-label">Hora</div>
                {['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'].map((d) => (
                  <div key={d} className="ad-heatmap-cell ad-heatmap-header-cell">{d}</div>
                ))}
              </div>
              {(ad.impressionsByTimeSlot?.heatmapData || []).slice(0, 12).map((row) => {
                const dayKeys = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
                const maxVal = Math.max(...dayKeys.map((d) => row[d] || 0));
                return (
                  <div key={row.hour} className="ad-heatmap-row">
                    <div className="ad-heatmap-cell ad-heatmap-label">{row.hour}</div>
                    {dayKeys.map((d) => (
                      <div
                        key={d}
                        className="ad-heatmap-cell"
                        style={{
                          '--intensity': maxVal ? (row[d] || 0) / maxVal : 0,
                        }}
                        title={`${row[d]?.toLocaleString() || 0}`}
                      />
                    ))}
                  </div>
                );
              })}
            </div>
          </div>
          <div className="ad-stacked-bar-wrap">
            <ResponsiveContainer width="100%" height={200}>
              <BarChart
                data={ad.impressionsByTimeSlot?.stackedByHour || []}
                margin={{ top: 8, right: 8 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#000000" vertical={false} />
                <XAxis dataKey="hour" stroke="#111827" />
                <YAxis stroke="#111827" />
                <Tooltip {...TOOLTIP_STYLE} />
                <Legend />
                <Bar dataKey="Tourism Board" stackId="a" fill="#b91c8c" />
                <Bar dataKey="Regional Airlines" stackId="a" fill="#111827" />
                <Bar dataKey="Hotel Group" stackId="a" fill="#6b7280" />
                <Bar dataKey="Local Experiences" stackId="a" fill="#374151" />
                <Bar dataKey="Car Rental Co" stackId="a" fill="#9ca3af" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>
      </div>

      <div className="ad-grid-2">
        <ChartCard
          title="CPM estimado (costo por 1,000 impresiones)"
          rightMeta={
            <span className="chart-meta-pill">
              {formatMxn(ad.estimatedCPM?.value)}
            </span>
          }
        >
          <div className="ad-table-wrap">
            <SortableTable
              columns={[
                { key: 'advertiser', label: 'Anunciante', sortable: true },
                { key: 'cpm', label: 'CPM (MXN)', sortable: true, format: (v) => (v != null ? formatMxn(v) : '—') },
                { key: 'impressions', label: 'Impresiones', sortable: true, format: (v) => v?.toLocaleString() },
              ]}
              data={ad.estimatedCPM?.comparisonByAdvertiser || []}
              defaultSortKey="impressions"
              className="ad-sortable-table"
            />
          </div>
        </ChartCard>

        <ChartCard title="Participación de exposición por marca">
          <div className="ad-donut-row">
            <ResponsiveContainer width="50%" height={200}>
              <PieChart>
                <Pie
                  data={ad.shareOfExposureByBrand || []}
                  dataKey="sharePct"
                  nameKey="brand"
                  cx="50%"
                  cy="50%"
                  innerRadius={56}
                  outerRadius={80}
                  paddingAngle={2}
                >
                  {(ad.shareOfExposureByBrand || []).map((_, i) => (
                    <Cell key={i} fill={DONUT_COLORS[i % DONUT_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip {...TOOLTIP_STYLE} formatter={(v) => `${v.toFixed(1)}%`} />
              </PieChart>
            </ResponsiveContainer>
            <div className="ad-donut-legend">
              {(ad.shareOfExposureByBrand || []).map((row, i) => (
                <div key={row.brand} className="ad-donut-legend-item">
                  <span className="ad-donut-dot" style={{ background: DONUT_COLORS[i % DONUT_COLORS.length] }} />
                  <span>{row.brand}: {row.sharePct.toFixed(1)}%</span>
                </div>
              ))}
            </div>
          </div>
          <div className="ad-table-wrap ad-table-wrap--compact">
            <SortableTable
              columns={[
                { key: 'brand', label: 'Marca', sortable: true },
                { key: 'sharePct', label: 'Participación %', sortable: true, format: (v) => `${v?.toFixed(1)}%` },
                { key: 'secondsTotal', label: 'Total seg', sortable: true, format: (v) => v?.toLocaleString() },
              ]}
              data={ad.shareOfExposureByBrand || []}
              defaultSortKey="sharePct"
              className="ad-sortable-table"
            />
          </div>
        </ChartCard>
      </div>

      <div className="ad-block">
        <ChartCard
          title="CTR (tasa de clics)"
          rightMeta={<span className="chart-meta-pill">{ad.ctr?.value}% total</span>}
        >
          <div className="ad-table-wrap">
            <SortableTable
              columns={[
                { key: 'advertiser', label: 'Anunciante', sortable: true },
                { key: 'ctr', label: 'CTR %', sortable: true, format: (v) => `${v}%` },
                { key: 'clicks', label: 'Clics', sortable: true, format: (v) => v?.toLocaleString() },
                { key: 'impressions', label: 'Impresiones', sortable: true, format: (v) => v?.toLocaleString() },
              ]}
              data={ad.ctr?.byAdvertiser || []}
              defaultSortKey="ctr"
              className="ad-sortable-table"
            />
          </div>
        </ChartCard>
      </div>

      <div className="ad-block">
        <ChartCard title="Tasa de conversión post-clic">
          <div className="ad-funnel-wrap">
            <ResponsiveContainer width="100%" height={220}>
              <BarChart
                data={ad.postClickConversionFunnel?.stages || []}
                layout="vertical"
                margin={{ left: 120, right: 24 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#000000" horizontal={false} />
                <XAxis type="number" stroke="#111827" tickFormatter={(v) => v >= 1000 ? `${(v / 1000).toFixed(1)}k` : v} />
                <YAxis type="category" dataKey="label" width={110} stroke="#111827" />
                <Tooltip {...TOOLTIP_STYLE} formatter={(v) => v.toLocaleString()} />
                <Bar dataKey="value" fill="#b91c8c" radius={[0, 0, 0, 0]} maxBarSize={44} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>
      </div>

      <div className="ad-grid-2">
        <ChartCard
          title="Ingresos por clic (modelo CPC)"
          rightMeta={
            <span className="chart-meta-pill">
              {formatMxn(ad.revenuePerClick?.value)}
            </span>
          }
        >
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={ad.revenuePerClick?.series || []}>
              <CartesianGrid strokeDasharray="3 3" stroke="#000000" vertical={false} />
              <XAxis dataKey="date" stroke="#111827" />
              <YAxis stroke="#111827" tickFormatter={(v) => formatMxn(v)} />
              <Tooltip {...TOOLTIP_STYLE} formatter={(v) => formatMxn(v)} />
              <Line type="monotone" dataKey="revenuePerClick" stroke="#b91c8c" strokeWidth={2} dot={{ r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard
          title="Ingresos por lead generado"
          rightMeta={
            <span className="chart-meta-pill">
              {formatMxn(ad.revenuePerLead?.value)}
            </span>
          }
        >
          <div className="ad-table-wrap">
            <SortableTable
              columns={[
                { key: 'advertiser', label: 'Anunciante', sortable: true },
                { key: 'revenuePerLead', label: 'Ing/lead (MXN)', sortable: true, format: (v) => formatMxn(v) },
                { key: 'leads', label: 'Leads', sortable: true, format: (v) => v?.toLocaleString() },
              ]}
              data={ad.revenuePerLead?.byAdvertiser || []}
              defaultSortKey="revenuePerLead"
              className="ad-sortable-table"
            />
          </div>
        </ChartCard>
      </div>
    </section>
  );
};
