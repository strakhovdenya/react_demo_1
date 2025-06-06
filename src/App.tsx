import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import CardDemoPage from './pages/CardDemoPage';
import TimelinePage from './pages/TimelinePage';

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/ru" replace />} />
        <Route path="/ru" element={<CardDemoPage />} />
        <Route path="/en" element={<CardDemoPage />} />
        <Route path="/ru/timeline" element={<TimelinePage />} />
        <Route path="/en/timeline" element={<TimelinePage />} />
        <Route path="*" element={<Navigate to="/ru" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
