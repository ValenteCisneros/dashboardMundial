import React from 'react';
import { useDashboard } from '../context/DashboardContext';
import { SkeletonBlock } from '../components/common/SkeletonBlock';
import { SectionIcon } from '../components/common/SectionIcon';

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
            <SectionIcon name="reports" />
            <div className="app-content-title">Reportes y exportación</div>
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
          <SectionIcon name="reports" />
          <div className="app-content-title">Reportes y exportación</div>
        </div>
      </header>

      <div className="reports-layout">
        <div className="reports-panel">
          <h3 className="reports-panel-title">Configuración de exportación</h3>

          <div className="reports-grid">
            <div className="reports-card">
              <h4 className="reports-card-title">Informe ejecutivo PDF</h4>
              <p className="reports-card-copy" aria-hidden="true">
                Resumen para liderazgo con KPIs, embudos de conversión y audiencia.
              </p>
              <button
                type="button"
                className="reports-export-button"
                onClick={() => handleExport('pdf')}
              >
                Exportar PDF
              </button>
            </div>

            <div className="reports-card">
              <h4 className="reports-card-title">Datos en CSV</h4>
              <p className="reports-card-copy" aria-hidden="true">
                Datos por fila para análisis en equipos de marketing e insights.
              </p>
              <button
                type="button"
                className="reports-export-button"
                onClick={() => handleExport('csv')}
              >
                Exportar CSV
              </button>
            </div>
          </div>
        </div>

        <div className="reports-summary">
          <h3 className="reports-panel-title">Alcance de exportación actual</h3>
          <ul className="reports-summary-list">
            <li>
              <span className="reports-summary-label">Rango de fechas</span>
              <span className="reports-summary-value">{dateRange?.label}</span>
            </li>
            <li>
              <span className="reports-summary-label">Alcance</span>
              <span className="reports-summary-value">Periodo actual</span>
            </li>
            <li>
              <span className="reports-summary-label">KPIs principales incluidos</span>
              <span className="reports-summary-value">
                Tiempo de sesión, entrada y conversión QR, abandono, desglose de usuarios detectados.
              </span>
            </li>
            <li>
              <span className="reports-summary-label">Secciones incluidas</span>
              <span className="reports-summary-value">
                Comportamiento, contenido turístico, insights de audiencia, impacto en marketing.
              </span>
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
};

