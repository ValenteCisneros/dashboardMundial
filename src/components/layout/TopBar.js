import React from 'react';
import { useDashboard } from '../../context/DashboardContext';

const DATE_PRESETS = [
  { id: 'last_7_days', label: 'Last 7 days' },
  { id: 'last_30_days', label: 'Last 30 days' },
  { id: 'this_month', label: 'This month' },
];

export const TopBar = ({ activeTabTitle }) => {
  const {
    dateRange,
    setDateRange,
    compareToPrevious,
    setCompareToPrevious,
    lastUpdated,
    refresh,
    status,
  } = useDashboard();

  const handleDateChange = (event) => {
    const presetId = event.target.value;
    const preset = DATE_PRESETS.find((p) => p.id === presetId);
    const nextRange = {
      preset: presetId,
      label: preset?.label || presetId,
    };
    setDateRange(nextRange);
    refresh({ dateRange: nextRange });
  };

  const handleToggleCompare = () => {
    const next = !compareToPrevious;
    setCompareToPrevious(next);
    refresh({ compareToPrevious: next });
  };

  const formattedUpdated =
    lastUpdated != null
      ? lastUpdated.toLocaleTimeString(undefined, {
          hour: '2-digit',
          minute: '2-digit',
        })
      : 'Loading';

  const isLoading = status === 'loading';

  return (
    <header className="app-topbar">
      <div className="app-topbar-left">
        <div className="app-topbar-title">{activeTabTitle}</div>
        <div className="app-topbar-subtitle">
          Executive-ready marketing analytics for kiosk-based tourism experiences.
        </div>
      </div>

      <div className="app-topbar-right">
        <div className="pill pill--accent">
          <span className="pill-dot" />
          <span>{isLoading ? 'Refreshing data…' : 'Live data view'}</span>
        </div>

        <div className="date-range-selector">
          <span>Date range</span>
          <select value={dateRange?.preset} onChange={handleDateChange}>
            {DATE_PRESETS.map((preset) => (
              <option key={preset.id} value={preset.id}>
                {preset.label}
              </option>
            ))}
          </select>
        </div>

        <button
          type="button"
          className={`toggle ${compareToPrevious ? 'toggle--on' : ''}`}
          onClick={handleToggleCompare}
        >
          <div className={`toggle-switch ${compareToPrevious ? 'toggle-switch--on' : ''}`}>
            <div className="toggle-switch-knob" />
          </div>
          <span>Compare to previous period</span>
        </button>

        <div className="pill">
          <span>Last updated</span>
          <strong>{formattedUpdated}</strong>
        </div>
      </div>
    </header>
  );
};

