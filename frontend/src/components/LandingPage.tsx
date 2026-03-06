import React from 'react';
import { LandingHero } from './LandingHero';
import { ProblemSection } from './ProblemSection';
import { TraditionalFarming } from './TraditionalFarming';
import { WhyNaturalFarming } from './WhyNaturalFarming';
import { AIPoweredFarming } from './AIPoweredFarming';
import { Testimonials } from './Testimonials';
import { RevenueModel } from './RevenueModel';
import { FinalCTA } from './FinalCTA';
import { useTranslation } from 'react-i18next';

interface LandingPageProps {
  onGetStarted?: () => void;
  onLearnHowAI?: () => void;
  onJoinMovement?: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({
  onGetStarted,
  onLearnHowAI,
  onJoinMovement,
}) => {
  const { t } = useTranslation();
  const handleFeatureClick = (feature: string) => {
    console.log(`User clicked on: ${feature}`);
    onGetStarted?.();
  };

  const handleContactExpert = () => {
    console.log('User wants to contact expert');
    onGetStarted?.();
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 text-gray-900 dark:text-white font-poppins transition-colors duration-300">
      <LandingHero 
        onGetStarted={onGetStarted}
        onLearnHowAI={onLearnHowAI}
        onJoinMovement={onJoinMovement}
      />
      
      <ProblemSection />
      
      <TraditionalFarming />
      
      <WhyNaturalFarming />
      
      <AIPoweredFarming 
        onFeatureClick={handleFeatureClick}
      />
      
      <Testimonials />
      
      <RevenueModel />
      
      <FinalCTA 
        onGetStarted={onGetStarted}
        onLearnHowAI={onLearnHowAI}
        onJoinMovement={onJoinMovement}
      />
    </div>
  );
};

export default LandingPage;
