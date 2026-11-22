import React, { useState } from 'react';
import './styles/tokens.css';
import './styles/base.css';

import Navbar from './components/Navbar/Navbar';
import Hero from './components/Hero/Hero';
import TrustBar from './components/Trust/TrustBar';
import FeaturesSection from './components/Features/FeaturesSection';
import ArchitectureSection from './components/Architecture/ArchitectureSection';
import IntegrationsSection from './components/Integrations/IntegrationsSection';
import BenefitsSection from './components/Benefits/BenefitsSection';
import StoriesSection from './components/Stories/StoriesSection';
import CtaBanner from './components/CTA/CtaBanner';
import Footer from './components/Footer/Footer';
import ControlPlaneModal from './components/Console/ControlPlaneModal';

export default function App() {
  const [consoleOpen, setConsoleOpen] = useState(false);
  const [consoleInitialView, setConsoleInitialView] = useState('dashboard');

  const handleOpenConsole = (view = 'dashboard') => {
    setConsoleInitialView(view);
    setConsoleOpen(true);
  };

  const handleCloseConsole = () => {
    setConsoleOpen(false);
  };

  return (
    <div className="aura-app">
      {/* 1. Sticky Navigation Bar */}
      <Navbar onOpenConsole={handleOpenConsole} />

      <main>
        {/* 2. Hero Section with Interactive Preview */}
        <Hero onOpenConsole={handleOpenConsole} />

        {/* 3. Customer Trust & Credibility Bar */}
        <TrustBar />

        {/* 4. Product & Feature Showcase (Alternating Rows) */}
        <FeaturesSection onOpenConsole={handleOpenConsole} />

        {/* 5. Platform Architecture Workflow (5-Phase Pipeline) */}
        <ArchitectureSection onOpenConsole={handleOpenConsole} />

        {/* 6. Integrations Showcase */}
        <IntegrationsSection />

        {/* 7. Benefits and Enterprise Outcomes */}
        <BenefitsSection />

        {/* 8. Customer Success Case Studies */}
        <StoriesSection />

        {/* 9. Final High-Impact Conversion CTA */}
        <CtaBanner onOpenConsole={handleOpenConsole} />
      </main>

      {/* 10. Comprehensive Footer */}
      <Footer onOpenConsole={handleOpenConsole} />

      {/* 11. Interactive Live Control Plane (Modal Overlay) */}
      <ControlPlaneModal
        isOpen={consoleOpen}
        onClose={handleCloseConsole}
        initialView={consoleInitialView}
      />
    </div>
  );
}
