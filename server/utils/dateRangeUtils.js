const PRESET_DAYS = {
  last_7_days: 7,
  last_30_days: 30,
  this_month: null,
};

function toISODateString(d) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

function getDateRangeForPreset(preset) {
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

module.exports = { getDateRangeForPreset, toISODateString };
