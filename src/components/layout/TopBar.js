import React from 'react';
import { useDashboard } from '../../context/DashboardContext';

const DATE_PRESETS = [
  { id: 'last_7_days', label: 'Últimos 7 días' },
  { id: 'last_30_days', label: 'Últimos 30 días' },
  { id: 'this_month', label: 'Este mes' },
];

export const TopBar = ({ activeTabTitle }) => {
  const { dateRange, setDateRange, lastUpdated, refresh, status } = useDashboard();

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

  const formattedUpdated =
    lastUpdated != null
      ? lastUpdated.toLocaleTimeString('es-MX', {
          hour: '2-digit',
          minute: '2-digit',
        })
      : 'Cargando…';

  const isLoading = status === 'loading';

  return (
    <header className="app-topbar">
      <div className="app-topbar-left">
        <div className="app-topbar-title">{activeTabTitle}</div>
        <div className="app-topbar-subtitle" aria-hidden="true" />
      </div>

      <div className="app-topbar-right">
        <div className="date-range-selector">
          <span>Rango de fechas</span>
          <select value={dateRange?.preset} onChange={handleDateChange}>
            {DATE_PRESETS.map((preset) => (
              <option key={preset.id} value={preset.id}>
                {preset.label}
              </option>
            ))}
          </select>
        </div>

        <div className="pill">
          <span>{isLoading ? 'Actualizando…' : 'Actualizado'}</span>
          <strong>{formattedUpdated}</strong>
        </div>
      </div>
    </header>
  );
};

