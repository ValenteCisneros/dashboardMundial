import React from 'react';

const NAV_ITEMS = [
  {
    id: 'executive',
    title: 'Executive overview',
    subtitle: 'Core KPIs and trends',
  },
  {
    id: 'behavior',
    title: 'User behavior',
    subtitle: 'Sessions, engagement, churn',
  },
  {
    id: 'tourism',
    title: 'Tourism content',
    subtitle: 'Content performance',
  },
  {
    id: 'audience',
    title: 'Audience insights',
    subtitle: 'Nationalities, repeat users',
  },
  {
    id: 'marketing',
    title: 'Marketing impact',
    subtitle: 'Leads and attribution',
  },
  {
    id: 'reports',
    title: 'Reports & export',
    subtitle: 'Exports and governance',
  },
];

export const Sidebar = ({ activeTab, onChangeTab }) => {
  return (
    <aside className="app-sidebar">
      <div className="app-sidebar-header">
        <div className="app-sidebar-logo" />
        <div className="app-sidebar-title">
          <span className="app-sidebar-title-main">Kiosk Analytics</span>
          <span className="app-sidebar-title-sub">Tourism & marketing insights</span>
        </div>
      </div>

      <nav className="app-sidebar-nav">
        <div className="app-sidebar-nav-section-label">Sections</div>
        {NAV_ITEMS.map((item) => {
          const isActive = item.id === activeTab;

          return (
            <button
              key={item.id}
              type="button"
              className={`app-sidebar-nav-item ${
                isActive ? 'app-sidebar-nav-item--active' : ''
              }`}
              onClick={() => onChangeTab(item.id)}
            >
              <div className="app-sidebar-nav-item-label">
                <span className="app-sidebar-nav-item-title">{item.title}</span>
                <span className="app-sidebar-nav-item-subtitle">{item.subtitle}</span>
              </div>
              {isActive && <span className="app-sidebar-nav-item-indicator" />}
            </button>
          );
        })}
      </nav>
    </aside>
  );
};

