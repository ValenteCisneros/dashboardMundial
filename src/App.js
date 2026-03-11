import React, { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';
import { DashboardProvider } from './context/DashboardContext';
import { LayoutShell } from './components/layout/LayoutShell';
import { TurismoMonterreyPage } from './pages/TurismoMonterreyPage';

function App() {
  const [activeTab, setActiveTab] = useState('behavior');

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/turismo/monterrey"
          element={<TurismoMonterreyPage />}
        />
        <Route
          path="/*"
          element={
            <DashboardProvider>
              <div className="App">
                <LayoutShell activeTab={activeTab} onChangeTab={setActiveTab} />
              </div>
            </DashboardProvider>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
