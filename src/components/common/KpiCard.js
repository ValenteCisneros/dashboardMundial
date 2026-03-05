import React from 'react';

const getTrendLabel = (trend) => {
  if (trend === 'up') return 'En alza';
  if (trend === 'down') return 'A la baja';
  return 'Estable';
};

export const KpiCard = ({
  label,
  value,
  unit,
  previous,
  changePct,
  trend,
  emphasis = 'primary',
  footer,
}) => {
  const formattedValue =
    unit === 'percent'
      ? `${value.toFixed(1)}%`
      : unit === 'minutes'
      ? `${value.toFixed(1)} min`
      : value.toLocaleString();

  const formattedPrevious =
    typeof previous === 'number'
      ? unit === 'percent'
        ? `${previous.toFixed(1)}%`
        : unit === 'minutes'
        ? `${previous.toFixed(1)} min`
        : previous.toLocaleString()
      : null;

  const formattedChange =
    typeof changePct === 'number' ? `${changePct > 0 ? '+' : ''}${changePct.toFixed(1)}%` : null;

  const isUp = trend === 'up';
  const isDown = trend === 'down';

  return (
    <div
      className="kpi-card"
      data-emphasis={emphasis}
    >
      <div className="kpi-card-header">
        <div className="kpi-title">{label}</div>
        {trend && (
          <div
            className={`kpi-trend-pill ${
              isUp ? 'kpi-trend-pill--up' : isDown ? 'kpi-trend-pill--down' : ''
            }`}
          >
            <span className="kpi-trend-indicator" />
            <span>{getTrendLabel(trend)}</span>
          </div>
        )}
      </div>

      <div className="kpi-main">
        <div className="kpi-value">{formattedValue}</div>
        {formattedChange && (
          <div className="kpi-delta">
            <span className="kpi-delta-value">{formattedChange}</span>
            {formattedPrevious && <span className="kpi-delta-previous">vs. {formattedPrevious}</span>}
          </div>
        )}
      </div>

      {footer && <div className="kpi-footer">{footer}</div>}
    </div>
  );
};

