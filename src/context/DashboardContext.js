import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { getDateRangeForPreset } from '../utils/dateRangeUtils';
import { DEFAULT_DATE_RANGE, fetchDashboardData } from '../api/dashboardApi';

const DashboardContext = createContext(null);

const PRESET_LABELS = {
  last_7_days: 'Últimos 7 días',
  last_30_days: 'Últimos 30 días',
  this_month: 'Este mes',
};

function buildInitialDateRange() {
  const preset = DEFAULT_DATE_RANGE.preset;
  return {
    preset,
    label: PRESET_LABELS[preset] ?? DEFAULT_DATE_RANGE.label,
    ...getDateRangeForPreset(preset),
  };
}

export const DashboardProvider = ({ children }) => {
  const [dateRange, setDateRange] = useState(() => buildInitialDateRange());
  const [compareToPrevious] = useState(false);
  const [data, setData] = useState(null);
  const [status, setStatus] = useState('idle');
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);

  const load = useCallback(
    async (overrides) => {
      const effectiveFilters = {
        dateRange: overrides?.dateRange || dateRange,
        compareToPrevious: overrides?.compareToPrevious ?? compareToPrevious,
      };

      setStatus('loading');
      setError(null);

      try {
        const result = await fetchDashboardData(effectiveFilters);
        setData(result);
        setStatus('success');
        setLastUpdated(new Date(result.meta?.generatedAt || Date.now()));
      } catch (e) {
        setError(e);
        setStatus('error');
      }
    },
    [dateRange, compareToPrevious]
  );

  useEffect(() => {
    load();
  }, [load]);

  const value = useMemo(
    () => ({
      data,
      status,
      error,
      dateRange,
      compareToPrevious,
      lastUpdated,
      setDateRange,
      refresh: load,
    }),
    [data, status, error, dateRange, compareToPrevious, lastUpdated, load]
  );

  return <DashboardContext.Provider value={value}>{children}</DashboardContext.Provider>;
};

export const useDashboard = () => {
  const ctx = useContext(DashboardContext);

  if (!ctx) {
    throw new Error('useDashboard must be used within a DashboardProvider');
  }

  return ctx;
};

