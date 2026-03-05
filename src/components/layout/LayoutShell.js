import React from 'react';
import { Sidebar } from './Sidebar';
import { TopBar } from './TopBar';
import { useDashboard } from '../../context/DashboardContext';
import { UserBehaviorAnalytics } from '../../sections/UserBehaviorAnalytics';
import { TourismContentAnalytics } from '../../sections/TourismContentAnalytics';
import { AudienceInsights } from '../../sections/AudienceInsights';
import { MarketingImpact } from '../../sections/MarketingImpact';
import { ReportsExport } from '../../sections/ReportsExport';

const TAB_TITLES = {
  behavior: 'Análisis de comportamiento',
  tourism: 'Contenido turístico',
  audience: 'Insights de audiencia',
  marketing: 'Impacto en marketing',
  reports: 'Reportes y exportación',
};

export const LayoutShell = ({ activeTab, onChangeTab }) => {
  const { status, error } = useDashboard();

  const renderSection = () => {
    if (status === 'error') {
      return (
        <div className="app-content-card">
          <div className="app-content-header">
            <div className="app-content-title-block">
              <div className="app-content-title">No se pudieron cargar los análisis</div>
            </div>
          </div>
          <pre className="error-panel">{error?.message || 'Error desconocido'}</pre>
        </div>
      );
    }

    switch (activeTab) {
      case 'behavior':
        return <UserBehaviorAnalytics />;
      case 'tourism':
        return <TourismContentAnalytics />;
      case 'audience':
        return <AudienceInsights />;
      case 'marketing':
        return <MarketingImpact />;
      case 'reports':
        return <ReportsExport />;
      default:
        return <UserBehaviorAnalytics />;
    }
  };

  const activeTitle = TAB_TITLES[activeTab] || TAB_TITLES.behavior;

  return (
    <div className="app-shell">
      <Sidebar activeTab={activeTab} onChangeTab={onChangeTab} />
      <main className="app-main">
        <TopBar activeTabTitle={activeTitle} />
        {renderSection()}
      </main>
    </div>
  );
};

