import React from 'react';

const MESSAGE = 'No hay datos disponibles para el rango seleccionado';

export function ChartEmptyState() {
  return (
    <div className="chart-empty-state" role="status">
      <p className="chart-empty-state-text">{MESSAGE}</p>
    </div>
  );
}
