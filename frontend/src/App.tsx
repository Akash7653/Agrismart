import { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import LandingPage from './components/LandingPage';
import ModernCropPrediction from './components/ModernCropPrediction';
import ModernDiseaseDetectionFixed from './components/ModernDiseaseDetectionFixed';
import ModernConsultationsReal from './components/ModernConsultationsReal';
import ModernMarketplaceFixed from './components/ModernMarketplaceFixed';
import ModernAnalytics from './components/ModernAnalytics';
import FarmResources from './components/FarmResources';
import UserHistory from './components/UserHistory';
import Hero from './components/Hero';
import Footer from './components/Footer';
import ChatBot from './components/ChatBot';
import AuthModal from './components/AuthModal';
import LearnHowAI from './components/LearnHowAI';
import JoinTheMovement from './components/JoinTheMovement';
import SideNav from './components/SideNav';
import Toast from './components/Toast';
import { ThemeProvider } from './context/ThemeContext';
import { LanguageProvider } from './context/LanguageContext';

type AppUser = { language?: string; name?: string } | null;

function App() {
  const [currentUser, setCurrentUser] = useState<AppUser>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [activeSection, setActiveSection] = useState('dashboard');
  const [isLoading, setIsLoading] = useState(true);
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [isLoginAction, setIsLoginAction] = useState(false);

  // Check for existing auth on mount
  useEffect(() => {
    const authToken = localStorage.getItem('authToken');
    const savedUser = localStorage.getItem('user');
    
    if (authToken && savedUser) {
      try {
        const user = JSON.parse(savedUser);
        setCurrentUser(user);
      } catch (err) {
        console.error('Failed to parse saved user:', err);
        localStorage.removeItem('authToken');
        localStorage.removeItem('user');
      }
    }
    
    setIsLoading(false);
  }, []);

  const handleAuth = (user: { language?: string; name?: string }) => {
    setCurrentUser(user);
    setShowSuccessToast(true);
    setIsLoginAction(true);
    setShowAuthModal(false);
  };

  const handleSignOut = () => {
    setCurrentUser(null);
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    setShowAuthModal(false);
  };

  const handleSectionNavigate = (section: string) => {
    setActiveSection(section);
  };

  return (
    <LanguageProvider>
      <ThemeProvider>
        <div id="dashboard" className={`min-h-screen bg-white dark:bg-gray-950 text-gray-900 dark:text-white font-poppins transition-colors duration-300`}>
          {!currentUser ? (
            <>
              <Navbar
                currentUser={currentUser}
                onAuthClick={() => setShowAuthModal(true)}
                onSignOut={handleSignOut}
              />
              {/* Routing for landing page CTAs */}
              {window.location.pathname === '/learn-how-ai' ? (
                <LearnHowAI />
              ) : window.location.pathname === '/join-the-movement' ? (
                <JoinTheMovement />
              ) : (
                <LandingPage 
                  onGetStarted={() => setShowAuthModal(true)}
                  onLearnHowAI={() => window.location.pathname = '/learn-how-ai'}
                  onJoinMovement={() => window.location.pathname = '/join-the-movement'}
                />
              )}
            </>
          ) : (
            <>
              <Navbar
                currentUser={currentUser}
                onAuthClick={() => setShowAuthModal(true)}
                onSignOut={handleSignOut}
                onNavigate={handleSectionNavigate}
              />
              <div className="flex flex-col lg:flex-row">
                <SideNav onNavigate={handleSectionNavigate} />
                <main className="flex-1 min-h-screen bg-white dark:bg-gray-950 w-full lg:w-auto">
                  <div className="px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
                    {activeSection === 'prediction' && <ModernCropPrediction />}
                    {activeSection === 'disease' && <ModernDiseaseDetectionFixed />}
                    {activeSection === 'consultations' && <ModernConsultationsReal />}
                    {activeSection === 'marketplace' && <ModernMarketplaceFixed />}
                    {activeSection === 'farmResources' && <FarmResources />}
                    {activeSection === 'history' && <UserHistory />}
                    {activeSection === 'analytics' && <ModernAnalytics />}
                    {activeSection === 'dashboard' && (
                      <>
                        <Hero currentUser={currentUser} onGetStarted={() => setShowAuthModal(true)} />
                        <ModernCropPrediction />
                        <ModernDiseaseDetectionFixed />
                        <ModernConsultationsReal />
                        <ModernMarketplaceFixed />
                        <FarmResources />
                        <UserHistory />
                        <ModernAnalytics />
                        <Footer />
                      </>
                    )}
                  </div>
                </main>
              </div>
              <ChatBot />
            </>
          )}
          <AuthModal
            isOpen={showAuthModal}
            onClose={() => setShowAuthModal(false)}
            onAuth={handleAuth}
          />
          {showSuccessToast && (
            <Toast
              message={isLoginAction ? 'Welcome back! You are now logged in!' : 'Welcome! You have been registered successfully!'}
              type="success"
              duration={3000}
              onClose={() => setShowSuccessToast(false)}
            />
          )}
        </div>
      </ThemeProvider>
    </LanguageProvider>
  );
}

export default App;