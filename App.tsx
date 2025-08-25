
import React, { useState, useCallback } from 'react';
import { Flashcard } from './types';
import { FlashcardProvider } from './hooks/useFlashcards';
import { ThemeProvider, useTheme } from './hooks/useTheme';
import HomeScreen from './components/HomeScreen';
import BaseSelectionScreen from './components/BaseSelectionScreen';
import FlashcardScreen from './components/FlashcardScreen';
import AdminPanel from './components/AdminPanel';
import CustomStudyScreen from './components/CustomStudyScreen';
import WelcomeScreen from './components/WelcomeScreen';
import { SunIcon, MoonIcon } from './components/icons/MedicalIcons';

type View = 'home' | 'base-selection' | 'study' | 'admin' | 'login' | 'custom-study' | 'welcome';

const ThemeSwitcher: React.FC = () => {
    const { theme, toggleTheme } = useTheme();
    return (
        <button
            onClick={toggleTheme}
            className="absolute top-4 right-4 p-2 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-offset-slate-900 transform hover:scale-110 transition-all duration-300 z-50"
            aria-label="Toggle theme"
        >
            {theme === 'dark' ? <SunIcon className="w-6 h-6" /> : <MoonIcon className="w-6 h-6" />}
        </button>
    );
};

const AppContent: React.FC = () => {
  const [view, setView] = useState<View>('welcome');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [studyDeck, setStudyDeck] = useState<Flashcard[]>([]);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);

  const handleLoginSuccess = (login: string) => {
    if (login === 'admin') {
        setIsAdmin(true);
    }
    setView('home');
  };

  const handleCategorySelect = useCallback((category: string) => {
    setSelectedCategory(category);
    setView('base-selection');
  }, []);
  
  const handleCustomStudySelect = useCallback(() => {
    setView('custom-study');
  }, []);

  const startStudySession = useCallback((deck: Flashcard[]) => {
    if (deck.length > 0) {
      setStudyDeck(deck);
      setView('study');
    } else {
      alert("Proszę wybrać bazę z pytaniami.");
    }
  }, []);

  const handleBackToHome = useCallback(() => {
    setSelectedCategory(null);
    setStudyDeck([]);
    setView('home');
  }, []);

  const navigateToAdmin = () => {
    if (isAdmin) {
      setView('admin');
    } else {
      setView('login');
    }
  };

  const renderView = () => {
    switch (view) {
      case 'welcome':
        return <WelcomeScreen onLoginSuccess={handleLoginSuccess} />;
      case 'study':
        return <FlashcardScreen key={studyDeck.map(c=>c.id).join('-')} deck={studyDeck} onFinish={handleBackToHome} />;
      case 'base-selection':
        return <BaseSelectionScreen category={selectedCategory!} onStartStudy={startStudySession} onBack={handleBackToHome} />;
      case 'custom-study':
        return <CustomStudyScreen onStartStudy={startStudySession} onBack={handleBackToHome} />;
      case 'login':
        return <AdminPanel onLoginSuccess={() => { setIsAdmin(true); setView('admin'); }} />;
      case 'admin':
        return <AdminPanel onLogout={() => { setIsAdmin(false); setView('home'); }} isAdmin={isAdmin} />;
      case 'home':
      default:
        return <HomeScreen onSelectCategory={handleCategorySelect} onAdminClick={navigateToAdmin} onCustomStudyClick={handleCustomStudySelect} />;
    }
  };
  
  return (
     <div className="relative bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-200 min-h-screen font-sans">
      <ThemeSwitcher />
      {renderView()}
    </div>
  )
}


const App: React.FC = () => {
  return (
    <ThemeProvider>
      <FlashcardProvider>
        <AppContent />
      </FlashcardProvider>
    </ThemeProvider>
  );
};

export default App;