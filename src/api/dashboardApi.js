import { post } from './client';

export const DEFAULT_DATE_RANGE = {
  preset: 'last_7_days',
  label: 'Últimos 7 días',
};

/**
 * Fetches dashboard data from the backend. Filters can include dateRange and compareToPrevious.
 * @param {Object} filters - { dateRange: { preset, label }, compareToPrevious?: boolean }
 * @returns {Promise<Object>} Full dashboard payload (meta, executiveOverview, userBehavior, etc.)
 */
export const fetchDashboardData = async (filters = {}) => {
  const mergedFilters = {
    dateRange: filters.dateRange || DEFAULT_DATE_RANGE,
    compareToPrevious: filters.compareToPrevious ?? false,
  };
  return post('dashboard', mergedFilters);
};
