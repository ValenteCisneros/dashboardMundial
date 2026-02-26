import React from 'react';
import { useDashboard } from '../context/DashboardContext';
import { SkeletonBlock } from '../components/common/SkeletonBlock';

export const ReportsExport = () => {
  const { data, status, dateRange, compareToPrevious } = useDashboard();

  const handleExport = (format) => {
    const payload = {
      format,
      dateRange,
      compareToPrevious,
      generatedAt: new Date().toISOString(),
    };

    // In production, this would call a backend export endpoint.
    // Here we simply log to the console so the UI remains fully wired.
    // eslint-disable-next-line no-console
    console.log('Requested export', payload);
  };

  if (status === 'loading' && !data) {
    return (
      <section className="app-content-card">
        <div className="app-content-header">
          <div className="app-content-title-block">
            <div className="app-content-title">Reports and export</div>
            <div className="app-content-subtitle">
              Governance-ready export views for distribution and archiving.
            </div>
          </div>
        </div>
        <SkeletonBlock lines={4} />
      </section>
    );
  }

  if (!data) {
    return null;
  }

  return (
    <section className="app-content-card">
      <header className="app-content-header">
        <div className="app-content-title-block">
          <div className="app-content-title">Reports and export</div>
          <div className="app-content-subtitle">
            Prepare executive-ready reports, export to PDF or CSV, and align on a common view of
            performance.
          </div>
        </div>
      </header>

      <div className="reports-layout">
        <div className="reports-panel">
          <h3 className="reports-panel-title">Export configuration</h3>
          <p className="reports-panel-copy">
            Choose the format and scope for your export. All exports respect the active date range
            and comparison settings from the top bar.
          </p>

          <div className="reports-grid">
            <div className="reports-card">
              <h4 className="reports-card-title">PDF executive brief</h4>
              <p className="reports-card-copy">
                Designed for senior leadership consumption, including key KPIs, conversion funnels,
                and audience summaries.
              </p>
              <button
                type="button"
                className="reports-export-button"
                onClick={() => handleExport('pdf')}
              >
                Export PDF
              </button>
            </div>

            <div className="reports-card">
              <h4 className="reports-card-title">CSV data extract</h4>
              <p className="reports-card-copy">
                Row-level data aligned to the structures used by the marketing and insights teams
                for further analysis.
              </p>
              <button
                type="button"
                className="reports-export-button"
                onClick={() => handleExport('csv')}
              >
                Export CSV
              </button>
            </div>
          </div>
        </div>

        <div className="reports-summary">
          <h3 className="reports-panel-title">Current export scope</h3>
          <ul className="reports-summary-list">
            <li>
              <span className="reports-summary-label">Date range</span>
              <span className="reports-summary-value">{dateRange?.label}</span>
            </li>
            <li>
              <span className="reports-summary-label">Comparison</span>
              <span className="reports-summary-value">
                {compareToPrevious ? 'Includes previous period comparison' : 'Current period only'}
              </span>
            </li>
            <li>
              <span className="reports-summary-label">Core KPIs included</span>
              <span className="reports-summary-value">
                Average session time, QR entry and conversion, churn, detected users breakdown.
              </span>
            </li>
            <li>
              <span className="reports-summary-label">Sections included</span>
              <span className="reports-summary-value">
                Executive overview, user behaviour, tourism content, audience insights, marketing
                impact.
              </span>
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
};

