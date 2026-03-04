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

const TOOLTIP_STYLE = {
  contentStyle: {
    background: '#0f172a',
    borderRadius: 10,
    border: '1px solid rgba(148, 163, 184, 0.5)',
    fontSize: 12,
  },
};

const GRADIENT_IDS = {
  bar: 'adBarGradient',
  area: 'adAreaGradient',
  donut: ['#a855f7', '#ec4899', '#38bdf8', '#22c55e', '#eab308'],
};

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
            <div className="app-content-title">Advertising performance</div>
            <div className="app-content-subtitle">Ad analytics and monetization metrics.</div>
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
          <div className="app-content-title">Advertising performance</div>
          <div className="app-content-subtitle">
            Enterprise analytics for ad impressions, reach, CPM, CTR, and conversion revenue.
          </div>
        </div>
      </header>

      {/* Executive overview */}
      <div className="ad-executive-block">
        <h3 className="ad-block-title">Executive overview</h3>
        <p className="ad-executive-copy">{summary.topInsight}</p>
        <div className="ad-health-badge" data-health={summary.health}>
          Performance health: {summary.health}
        </div>
      </div>

      {/* Filters */}
      <div className="ad-filters">
        <div className="ad-filter-group">
          <label className="ad-filter-label">Advertiser</label>
          <select
            className="ad-filter-select"
            value={advertiserFilter}
            onChange={(e) => setAdvertiserFilter(e.target.value)}
          >
            <option value="all">All advertisers</option>
            {filters.advertisers.map((a) => (
              <option key={a.value} value={a.value}>{a.label}</option>
            ))}
          </select>
        </div>
        <div className="ad-filter-group">
          <label className="ad-filter-label">Location</label>
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
          <label className="ad-filter-label">Time slot</label>
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

      {/* Top-level KPI summary row */}
      <div className="ad-kpi-summary">
        <div className="ad-kpi-tile ad-kpi-tile--primary">
          <div className="ad-kpi-tile-label">Total impressions</div>
          <div className="ad-kpi-tile-value">{ad.totalImpressionsSum?.toLocaleString() ?? '—'}</div>
        </div>
        <div className="ad-kpi-tile">
          <div className="ad-kpi-tile-label">Avg frequency per user</div>
          <div className="ad-kpi-tile-value">{ad.averageFrequencyPerUser?.value ?? '—'}</div>
          <div className="ad-kpi-tile-meta">vs {ad.averageFrequencyPerUser?.previous} prior</div>
        </div>
        <div className="ad-kpi-tile">
          <div className="ad-kpi-tile-label">Est. daily reach</div>
          <div className="ad-kpi-tile-value">{ad.estimatedDailyReach?.value?.toLocaleString() ?? '—'}</div>
          <div className="ad-kpi-tile-meta">unique users</div>
        </div>
        <div className="ad-kpi-tile">
          <div className="ad-kpi-tile-label">Est. CPM</div>
          <div className="ad-kpi-tile-value">{formatMxn(ad.estimatedCPM?.value)}</div>
        </div>
        <div className="ad-kpi-tile">
          <div className="ad-kpi-tile-label">CTR</div>
          <div className="ad-kpi-tile-value">{ad.ctr?.value != null ? `${ad.ctr.value}%` : '—'}</div>
          <div className="ad-kpi-tile-meta">registration landing</div>
        </div>
        <div className="ad-kpi-tile">
          <div className="ad-kpi-tile-label">Revenue per click</div>
          <div className="ad-kpi-tile-value">{formatMxn(ad.revenuePerClick?.value)}</div>
        </div>
        <div className="ad-kpi-tile">
          <div className="ad-kpi-tile-label">Revenue per lead</div>
          <div className="ad-kpi-tile-value">{formatMxn(ad.revenuePerLead?.value)}</div>
        </div>
      </div>

      {/* Total Impressions per Ad */}
      <div className="ad-block">
        <ChartCard
          title="Total impressions per ad"
          subtitle="Total number of times each advertisement was displayed. Ranked by highest impressions."
        >
          <div className="ad-chart-row">
            <ResponsiveContainer width="100%" height={280}>
              <BarChart
                data={ad.totalImpressionsPerAd || []}
                layout="vertical"
                margin={{ left: 8, right: 24 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" horizontal={false} />
                <XAxis type="number" stroke="#94a3b8" tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`} />
                <YAxis type="category" dataKey="adName" width={140} stroke="#94a3b8" tick={{ fontSize: 11 }} />
                <Tooltip {...TOOLTIP_STYLE} formatter={(v) => v.toLocaleString()} />
                <Bar dataKey="impressions" fill="url(#adBarGradient)" radius={[0, 4, 4, 0]} maxBarSize={28} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <defs>
            <linearGradient id="adBarGradient" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#6366f1" />
              <stop offset="50%" stopColor="#a855f7" />
              <stop offset="100%" stopColor="#ec4899" />
            </linearGradient>
          </defs>
        </ChartCard>
      </div>

      {/* Average Frequency per User + Average Exposure Time */}
      <div className="ad-grid-2">
        <ChartCard
          title="Average frequency per user"
          subtitle="Average number of times a single user was exposed to the same ad in one session."
          rightMeta={<span className="chart-meta-pill">{ad.averageFrequencyPerUser?.value} avg</span>}
        >
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={ad.averageFrequencyPerUser?.distribution || []}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
              <XAxis dataKey="bucket" stroke="#94a3b8" />
              <YAxis stroke="#94a3b8" />
              <Tooltip {...TOOLTIP_STYLE} />
              <Bar dataKey="users" fill="url(#adFreqGradient)" radius={[6, 6, 0, 0]} maxBarSize={48} />
              <defs>
                <linearGradient id="adFreqGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#a855f7" />
                  <stop offset="100%" stopColor="#ec4899" />
                </linearGradient>
              </defs>
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard
          title="Average exposure time per ad"
          subtitle="Average seconds each ad remained visible on screen, by advertiser."
        >
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={ad.averageExposureTimePerAd || []}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
              <XAxis dataKey="advertiser" stroke="#94a3b8" tick={{ fontSize: 10 }} />
              <YAxis stroke="#94a3b8" tickFormatter={(v) => `${v}s`} />
              <Tooltip {...TOOLTIP_STYLE} formatter={(v) => `${v} sec`} />
              <Bar dataKey="seconds" fill="url(#adExposureGradient)" radius={[6, 6, 0, 0]} maxBarSize={40} />
              <defs>
                <linearGradient id="adExposureGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#38bdf8" />
                  <stop offset="100%" stopColor="#a855f7" />
                </linearGradient>
              </defs>
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* Estimated Daily Reach */}
      <div className="ad-block">
        <ChartCard
          title="Estimated daily reach"
          subtitle="Estimated unique individuals exposed to rotating ads per day."
          rightMeta={
            <span className="chart-meta-pill">
              {ad.estimatedDailyReach?.value?.toLocaleString()} avg
            </span>
          }
        >
          <ResponsiveContainer width="100%" height={240}>
            <LineChart data={ad.estimatedDailyReach?.dailyTrend || []}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
              <XAxis dataKey="date" stroke="#94a3b8" />
              <YAxis stroke="#94a3b8" />
              <Tooltip {...TOOLTIP_STYLE} />
              <Line type="monotone" dataKey="reach" stroke="#a855f7" strokeWidth={2} dot={{ r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* Impressions by Time Slot: heatmap + stacked bar */}
      <div className="ad-block">
        <ChartCard
          title="Impressions by time slot"
          subtitle="Ad impressions by hourly time blocks to identify peak exposure windows."
        >
          <div className="ad-heatmap-wrap">
            <div className="ad-heatmap">
              <div className="ad-heatmap-row ad-heatmap-header">
                <div className="ad-heatmap-cell ad-heatmap-label">Hour</div>
                {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((d) => (
                  <div key={d} className="ad-heatmap-cell ad-heatmap-header-cell">{d}</div>
                ))}
              </div>
              {(ad.impressionsByTimeSlot?.heatmapData || []).slice(0, 12).map((row) => {
                const maxVal = Math.max(...['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((d) => row[d] || 0));
                return (
                  <div key={row.hour} className="ad-heatmap-row">
                    <div className="ad-heatmap-cell ad-heatmap-label">{row.hour}</div>
                    {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((d) => (
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
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                <XAxis dataKey="hour" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip {...TOOLTIP_STYLE} />
                <Legend />
                <Bar dataKey="Tourism Board" stackId="a" fill="#a855f7" />
                <Bar dataKey="Regional Airlines" stackId="a" fill="#ec4899" />
                <Bar dataKey="Hotel Group" stackId="a" fill="#38bdf8" />
                <Bar dataKey="Local Experiences" stackId="a" fill="#22c55e" />
                <Bar dataKey="Car Rental Co" stackId="a" fill="#eab308" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>
      </div>

      {/* Estimated CPM + Share of Exposure */}
      <div className="ad-grid-2">
        <ChartCard
          title="Estimated CPM (cost per 1,000 impressions)"
          subtitle="Estimated cost per thousand impressions for monetization analysis."
          rightMeta={
            <span className="chart-meta-pill">
              {formatMxn(ad.estimatedCPM?.value)}
            </span>
          }
        >
          <div className="ad-table-wrap">
            <SortableTable
              columns={[
                { key: 'advertiser', label: 'Advertiser', sortable: true },
                { key: 'cpm', label: 'CPM (MXN)', sortable: true, format: (v) => (v != null ? formatMxn(v) : '—') },
                { key: 'impressions', label: 'Impressions', sortable: true, format: (v) => v?.toLocaleString() },
              ]}
              data={ad.estimatedCPM?.comparisonByAdvertiser || []}
              defaultSortKey="impressions"
              className="ad-sortable-table"
            />
          </div>
        </ChartCard>

        <ChartCard
          title="Share of exposure by brand"
          subtitle="Percentage of total screen time allocated to each advertiser."
        >
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
                    <Cell key={i} fill={GRADIENT_IDS.donut[i % GRADIENT_IDS.donut.length]} />
                  ))}
                </Pie>
                <Tooltip {...TOOLTIP_STYLE} formatter={(v) => `${v.toFixed(1)}%`} />
              </PieChart>
            </ResponsiveContainer>
            <div className="ad-donut-legend">
              {(ad.shareOfExposureByBrand || []).map((row, i) => (
                <div key={row.brand} className="ad-donut-legend-item">
                  <span className="ad-donut-dot" style={{ background: GRADIENT_IDS.donut[i % GRADIENT_IDS.donut.length] }} />
                  <span>{row.brand}: {row.sharePct.toFixed(1)}%</span>
                </div>
              ))}
            </div>
          </div>
          <div className="ad-table-wrap ad-table-wrap--compact">
            <SortableTable
              columns={[
                { key: 'brand', label: 'Brand', sortable: true },
                { key: 'sharePct', label: 'Share %', sortable: true, format: (v) => `${v?.toFixed(1)}%` },
                { key: 'secondsTotal', label: 'Total sec', sortable: true, format: (v) => v?.toLocaleString() },
              ]}
              data={ad.shareOfExposureByBrand || []}
              defaultSortKey="sharePct"
              className="ad-sortable-table"
            />
          </div>
        </ChartCard>
      </div>

      {/* CTR by advertiser */}
      <div className="ad-block">
        <ChartCard
          title="CTR (click-through rate)"
          subtitle="Clicks divided by impressions for ads on the registration landing page."
          rightMeta={<span className="chart-meta-pill">{ad.ctr?.value}% overall</span>}
        >
          <div className="ad-table-wrap">
            <SortableTable
              columns={[
                { key: 'advertiser', label: 'Advertiser', sortable: true },
                { key: 'ctr', label: 'CTR %', sortable: true, format: (v) => `${v}%` },
                { key: 'clicks', label: 'Clicks', sortable: true, format: (v) => v?.toLocaleString() },
                { key: 'impressions', label: 'Impressions', sortable: true, format: (v) => v?.toLocaleString() },
              ]}
              data={ad.ctr?.byAdvertiser || []}
              defaultSortKey="ctr"
              className="ad-sortable-table"
            />
          </div>
        </ChartCard>
      </div>

      {/* Post-click conversion funnel */}
      <div className="ad-block">
        <ChartCard
          title="Post-click conversion rate"
          subtitle="Impressions to clicks to conversions (desired action completed)."
        >
          <div className="ad-funnel-wrap">
            <ResponsiveContainer width="100%" height={220}>
              <BarChart
                data={ad.postClickConversionFunnel?.stages || []}
                layout="vertical"
                margin={{ left: 120, right: 24 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" horizontal={false} />
                <XAxis type="number" stroke="#94a3b8" tickFormatter={(v) => v >= 1000 ? `${(v / 1000).toFixed(1)}k` : v} />
                <YAxis type="category" dataKey="label" width={110} stroke="#94a3b8" />
                <Tooltip {...TOOLTIP_STYLE} formatter={(v) => v.toLocaleString()} />
                <Bar dataKey="value" fill="url(#adFunnelGradient)" radius={[0, 4, 4, 0]} maxBarSize={44} />
                <defs>
                  <linearGradient id="adFunnelGradient" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#22c55e" />
                    <stop offset="50%" stopColor="#a855f7" />
                    <stop offset="100%" stopColor="#ec4899" />
                  </linearGradient>
                </defs>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>
      </div>

      {/* Revenue per Click + Revenue per Lead */}
      <div className="ad-grid-2">
        <ChartCard
          title="Revenue per click (CPC model)"
          subtitle="Revenue generated per ad click under cost-per-click monetization."
          rightMeta={
            <span className="chart-meta-pill">
              {formatMxn(ad.revenuePerClick?.value)}
            </span>
          }
        >
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={ad.revenuePerClick?.series || []}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
              <XAxis dataKey="date" stroke="#94a3b8" />
              <YAxis stroke="#94a3b8" tickFormatter={(v) => formatMxn(v)} />
              <Tooltip {...TOOLTIP_STYLE} formatter={(v) => formatMxn(v)} />
              <Line type="monotone" dataKey="revenuePerClick" stroke="#22c55e" strokeWidth={2} dot={{ r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard
          title="Revenue per lead generated"
          subtitle="Revenue from completed registrations or qualified leads."
          rightMeta={
            <span className="chart-meta-pill">
              {formatMxn(ad.revenuePerLead?.value)}
            </span>
          }
        >
          <div className="ad-table-wrap">
            <SortableTable
              columns={[
                { key: 'advertiser', label: 'Advertiser', sortable: true },
                { key: 'revenuePerLead', label: 'Rev/lead (MXN)', sortable: true, format: (v) => formatMxn(v) },
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
