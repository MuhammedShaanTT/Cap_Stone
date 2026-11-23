import React, { useState } from 'react';
import './styles/tokens.css';
import './styles/base.css';

import Navbar from './components/Navbar/Navbar';
import Hero from './components/Hero/Hero';
import ControlPlaneModal from './components/Console/ControlPlaneModal';

export default function App() {
  const [consoleOpen, setConsoleOpen] = useState(false);
  const [consoleInitialView, setConsoleInitialView] = useState('dashboard');
  const [consoleInitialMode, setConsoleInitialMode] = useState('testing');

  const handleOpenConsole = (view = 'dashboard', mode = 'testing') => {
    setConsoleInitialView(view);
    setConsoleInitialMode(mode);
    setConsoleOpen(true);
  };

  const handleCloseConsole = () => {
    setConsoleOpen(false);
  };

  return (
    <div className="aura-app">
      <Navbar onOpenConsole={handleOpenConsole} />
      <main>
        <Hero onOpenConsole={handleOpenConsole} />
      </main>
      <ControlPlaneModal
        isOpen={consoleOpen}
        onClose={handleCloseConsole}
        initialView={consoleInitialView}
        initialMode={consoleInitialMode}
      />
    </div>
  );
}
