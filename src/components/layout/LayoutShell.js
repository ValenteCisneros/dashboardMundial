import React from 'react';
import { Sidebar } from './Sidebar';
import { TopBar } from './TopBar';
import { useDashboard } from '../../context/DashboardContext';
import { ExecutiveOverview } from '../../sections/ExecutiveOverview';
import { UserBehaviorAnalytics } from '../../sections/UserBehaviorAnalytics';
import { TourismContentAnalytics } from '../../sections/TourismContentAnalytics';
import { AudienceInsights } from '../../sections/AudienceInsights';
import { MarketingImpact } from '../../sections/MarketingImpact';
import { ReportsExport } from '../../sections/ReportsExport';

const TAB_TITLES = {
  executive: 'Executive overview',
  behavior: 'User behavior analytics',
  tourism: 'Tourism content analytics',
  audience: 'Audience insights',
  marketing: 'Marketing impact',
  reports: 'Reports and export',
};

export const LayoutShell = ({ activeTab, onChangeTab }) => {
  const { status, error } = useDashboard();

  const renderSection = () => {
    if (status === 'error') {
      return (
        <div className="app-content-card">
          <div className="app-content-header">
            <div className="app-content-title-block">
              <div className="app-content-title">Unable to load analytics</div>
              <div className="app-content-subtitle">
                There was a problem retrieving data from the analytics service. Please try again or
                contact your system administrator.
              </div>
            </div>
          </div>
          <pre className="error-panel">{error?.message || 'Unknown error'}</pre>
        </div>
      );
    }

    switch (activeTab) {
      case 'executive':
        return <ExecutiveOverview />;
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
        return <ExecutiveOverview />;
    }
  };

  const activeTitle = TAB_TITLES[activeTab] || TAB_TITLES.executive;

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

