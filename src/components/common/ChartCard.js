import React from 'react';

export const ChartCard = ({ title, subtitle, children, rightMeta }) => {
  return (
    <section className="chart-card">
      <header className="chart-card-header">
        <div className="chart-card-title-block">
          <div className="chart-card-title">{title}</div>
          {subtitle && <div className="chart-card-subtitle">{subtitle}</div>}
        </div>
        {rightMeta && <div className="chart-card-meta">{rightMeta}</div>}
      </header>
      <div className="chart-card-body">{children}</div>
    </section>
  );
};

