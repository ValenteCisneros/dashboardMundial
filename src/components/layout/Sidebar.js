import React from 'react';
import {
  Activity,
  MapPin,
  Users,
  Megaphone,
  FileDown,
} from 'lucide-react';

const NAV_ITEMS = [
  { id: 'behavior', title: 'Comportamiento de usuarios', icon: Activity },
  { id: 'tourism', title: 'Contenido turístico', icon: MapPin },
  { id: 'audience', title: 'Insights de audiencia', icon: Users },
  { id: 'marketing', title: 'Impacto en marketing', icon: Megaphone },
  { id: 'reports', title: 'Reportes y exportación', icon: FileDown },
];

export const Sidebar = ({ activeTab, onChangeTab }) => {
  return (
    <aside className="app-sidebar">
      <div className="app-sidebar-header">
        <div className="app-sidebar-logo" />
        <div className="app-sidebar-title">
          <span className="app-sidebar-title-main">
            Woho Real-Time Marketing Metrics – Kiosko Mundial Monterrey
          </span>
          <span className="app-sidebar-title-sub" aria-hidden="true" />
        </div>
      </div>

      <nav className="app-sidebar-nav">
        <div className="app-sidebar-nav-section-label">Secciones</div>
        {NAV_ITEMS.map((item) => {
          const isActive = item.id === activeTab;
          const Icon = item.icon;

          return (
            <button
              key={item.id}
              type="button"
              className={`app-sidebar-nav-item ${
                isActive ? 'app-sidebar-nav-item--active' : ''
              }`}
              onClick={() => onChangeTab(item.id)}
            >
              <div className="app-sidebar-nav-item-inner">
                <span className="app-sidebar-nav-item-icon" aria-hidden="true">
                  <Icon size={20} strokeWidth={1.8} />
                </span>
                <span className="app-sidebar-nav-item-title">{item.title}</span>
              </div>
              {isActive && <span className="app-sidebar-nav-item-indicator" />}
            </button>
          );
        })}
      </nav>
    </aside>
  );
};
