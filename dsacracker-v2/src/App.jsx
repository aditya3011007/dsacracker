import React from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import ThreeBackground from './components/ThreeBackground/ThreeBackground';
import FloatingDock from './components/FloatingDock/FloatingDock';
import CursorGlow from './components/CursorGlow/CursorGlow';
import DailyChallenge from './components/DailyChallenge/DailyChallenge';
import { AnimatePresence } from 'framer-motion';

import Dashboard from './pages/Dashboard/Dashboard';
import Topic from './pages/Topic/Topic';
import About from './pages/About/About';
import Stats from './pages/Stats/Stats';
import Auth from './pages/Auth/Auth';

const AppRoutes = () => {
  const location = useLocation();
  return (
    <>
      {/* Global Aesthetics */}
      <ThreeBackground />
      <CursorGlow />

      {/* Main Content Area */}
      <main className="relative z-10 min-h-screen pb-32">
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/topic/:id" element={<Topic />} />
            <Route path="/stats" element={<Stats />} />
            <Route path="/about" element={<About />} />
          </Routes>
        </AnimatePresence>
      </main>

      {/* Navigation */}
      <FloatingDock />
      <DailyChallenge />
    </>
  );
};

function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}

export default App;
