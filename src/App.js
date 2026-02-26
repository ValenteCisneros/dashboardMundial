import React, { useState } from 'react';
import './App.css';
import { DashboardProvider } from './context/DashboardContext';
import { LayoutShell } from './components/layout/LayoutShell';

function App() {
  const [activeTab, setActiveTab] = useState('executive');

  return (
    <DashboardProvider>
      <div className="App">
        <LayoutShell activeTab={activeTab} onChangeTab={setActiveTab} />
      </div>
    </DashboardProvider>
  );
}

export default App;
