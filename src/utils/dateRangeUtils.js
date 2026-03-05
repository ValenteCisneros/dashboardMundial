/**
 * Global date range utilities for dashboard filtering.
 * All dates are ISO date strings (YYYY-MM-DD) for consistent comparison.
 */

const PRESET_DAYS = {
  last_7_days: 7,
  last_30_days: 30,
  this_month: null, // use month boundaries
};

/**
 * Returns start and end date for a preset (inclusive).
 * @param {string} preset - 'last_7_days' | 'last_30_days' | 'this_month'
 * @returns {{ startDate: string, endDate: string }} ISO date strings
 */
export function getDateRangeForPreset(preset) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  let start;
  const end = new Date(today);
  end.setHours(23, 59, 59, 999);

  if (preset === 'this_month') {
    start = new Date(today.getFullYear(), today.getMonth(), 1);
  } else {
    const days = PRESET_DAYS[preset] ?? 7;
    start = new Date(today);
    start.setDate(start.getDate() - (days - 1));
    start.setHours(0, 0, 0, 0);
  }

  return {
    startDate: toISODateString(start),
    endDate: toISODateString(end),
  };
}

/**
 * @param {Date} d
 * @returns {string} YYYY-MM-DD
 */
export function toISODateString(d) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

/**
 * Filter a time-series array by date range (inclusive).
 * Each point must have a `date` property (YYYY-MM-DD).
 * Does not mutate the original array.
 * @param {Array<{ date: string, [key: string]: unknown }>} series
 * @param {string} startDate - ISO date string
 * @param {string} endDate - ISO date string
 * @returns {Array}
 */
export function filterSeriesByDateRange(series, startDate, endDate) {
  if (!Array.isArray(series) || !startDate || !endDate) return series ?? [];
  return series.filter((point) => {
    const d = point.date;
    if (!d) return false;
    return d >= startDate && d <= endDate;
  });
}

/**
 * Format ISO date for chart display (e.g. "01 Mar 2026").
 * @param {string} isoDate - YYYY-MM-DD
 * @param {string} [locale] - e.g. 'es-MX'
 * @returns {string}
 */
export function formatDateForChart(isoDate, locale = 'es-MX') {
  if (!isoDate) return '';
  const [y, m, d] = isoDate.split('-').map(Number);
  const date = new Date(y, m - 1, d);
  return date.toLocaleDateString(locale, {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).replace(/ /g, ' ');
}
