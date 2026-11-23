import React from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar/Navbar';
import Hero from '../components/Hero/Hero';
import TrustBar from '../components/Trust/TrustBar';
import FeaturesSection from '../components/Features/FeaturesSection';
import ArchitectureSection from '../components/Architecture/ArchitectureSection';
import IntegrationsSection from '../components/Integrations/IntegrationsSection';
import BenefitsSection from '../components/Benefits/BenefitsSection';
import StoriesSection from '../components/Stories/StoriesSection';
import CtaBanner from '../components/CTA/CtaBanner';
import Footer from '../components/Footer/Footer';

export default function LandingPage() {
  const navigate = useNavigate();

  const handleOpenConsole = (view = 'dashboard') => {
    if (view === 'login') {
      navigate('/login');
    } else {
      navigate('/app/projects');
    }
  };

  return (
    <div className="aura-app">
      {/* 1. Header */}
      <Navbar onOpenConsole={handleOpenConsole} />

      <main>
        {/* 2. Hero */}
        <Hero onOpenConsole={handleOpenConsole} />

        {/* 3. Tech Stack Trust Bar */}
        <TrustBar />

        {/* 4. Features */}
        <FeaturesSection onOpenConsole={handleOpenConsole} />

        {/* 5. 5-Phase Architecture */}
        <ArchitectureSection onOpenConsole={handleOpenConsole} />

        {/* 6. Integrations */}
        <IntegrationsSection />

        {/* 7. Benefits */}
        <BenefitsSection />

        {/* 8. Success Stories / Architecture Highlights */}
        <StoriesSection />

        {/* 9. Final High-Impact CTA */}
        <CtaBanner onOpenConsole={handleOpenConsole} />
      </main>

      {/* 10. Footer */}
      <Footer onOpenConsole={handleOpenConsole} />
    </div>
  );
}
