
import React, { useMemo } from 'react';
import { useFlashcards } from '../hooks/useFlashcards';
import { useTheme } from '../hooks/useTheme';
import { User } from '../types';
import { 
    ShuffleIcon,
    JurisprudenceIcon,
    AdminIcon,
    InternalMedicineIcon,
    PediatricsIcon,
    SurgeryIcon,
    GynecologyIcon,
    FamilyMedicineIcon,
    PsychiatryIcon,
    EmergencyMedicineIcon,
    BioethicsIcon,
    PublicHealthIcon
} from './icons/MedicalIcons';

interface HomeScreenProps {
  onSelectCategory: (category: string) => void;
  onAdminClick: () => void;
  onCustomStudyClick: () => void;
  currentUser: User | null;
  onLogout: () => void;
}

const formatTimeLeft = (endDate: number): string => {
    const now = Date.now();
    if (endDate < now) {
        return "Subskrypcja wygasła";
    }
    const diff = endDate - now;
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    let result = "Pozostało: ";
    if (days > 0) result += `${days} d, `;
    if (hours > 0 || days > 0) result += `${hours} g, `;
    result += `${minutes} m`;
    
    return result.trim().replace(/,$/, '');
}

const HomeScreen: React.FC<HomeScreenProps> = ({ onSelectCategory, onAdminClick, onCustomStudyClick, currentUser, onLogout }) => {
  const { flashcards, categories } = useFlashcards();
  
  const hasActiveSubscription = useMemo(() => {
    if (!currentUser) return false;
    if (currentUser.subscription?.type === 'premium') return true;
    return currentUser.isActive && currentUser.subscription && currentUser.subscription.endDate > Date.now();
  }, [currentUser]);

  const categoriesWithCounts = useMemo(() => {
    const counts: { [key: string]: number } = {};
    flashcards.forEach(card => {
        counts[card.category] = (counts[card.category] || 0) + 1;
    });

    const allCategories = [
      ...categories.map(cat => ({ name: `${cat} [${counts[cat] || 0}]`, originalName: cat, count: counts[cat] || 0 }))
    ];
    
    return allCategories;
  }, [flashcards, categories]);

  const categoryIcons: { [key: string]: React.ReactElement } = useMemo(() => ({
    "Bioetyka i prawo medyczne": <BioethicsIcon className="w-10 h-10 text-indigo-500" />,
    "Orzecznictwo": <JurisprudenceIcon className="w-10 h-10 text-sky-500" />,
    "Interna": <InternalMedicineIcon className="w-10 h-10 text-red-500" />,
    "Pediatria": <PediatricsIcon className="w-10 h-10 text-pink-500" />,
    "Chirurgia": <SurgeryIcon className="w-10 h-10 text-emerald-500" />,
    "Ginekologia i położnictwo": <GynecologyIcon className="w-10 h-10 text-purple-500" />,
    "Medycyna rodzinna": <FamilyMedicineIcon className="w-10 h-10 text-orange-500" />,
    "Medycyna ratunkowa i intensywna terapia": <EmergencyMedicineIcon className="w-10 h-10 text-yellow-500" />,
    "Psychiatria": <PsychiatryIcon className="w-10 h-10 text-cyan-500" />,
    "Zdrowie publiczne": <PublicHealthIcon className="w-10 h-10 text-teal-500" />
  }), []);


  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 sm:p-6 lg:p-8">
        {currentUser && (
            <div className="absolute top-4 right-16 sm:right-24 flex items-center gap-2 sm:gap-4 z-40">
                <div className="hidden sm:flex flex-col items-end">
                    <span className="text-slate-600 dark:text-slate-400 text-sm">Zalogowano jako: <strong>{currentUser.name}</strong></span>
                     {currentUser.subscription?.type === 'premium' ? (
                        <span className="text-xs text-green-500 font-semibold">(Dostęp bezterminowy)</span>
                    ) : currentUser.subscription && currentUser.subscription.endDate > Date.now() ? (
                        <span className="text-xs text-slate-500 dark:text-slate-400">({formatTimeLeft(currentUser.subscription.endDate)})</span>
                    ) : (
                        <span className="text-xs text-red-500 font-semibold">(Brak aktywnej subskrypcji)</span>
                    )}
                </div>
                <button
                    onClick={onAdminClick}
                    aria-label="Panel Administratora"
                    className="p-2 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-600"
                >
                    <AdminIcon className="w-5 h-5" />
                </button>
                <button onClick={onLogout} className="bg-slate-200 hover:bg-slate-300 dark:bg-slate-600 dark:hover:bg-slate-700 text-slate-800 dark:text-white font-bold py-1 px-3 text-xs sm:py-2 sm:px-4 sm:text-sm rounded-lg transition-colors">
                    Wyloguj
                </button>
            </div>
        )}
        <header className="text-center mb-8">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                Let's <span className="text-blue-600 dark:text-blue-500">LEK</span> this!
            </h1>
            <p className="mt-2 text-lg text-slate-600 dark:text-slate-400">Twoje interaktywne fiszki do egzaminu LEK</p>
        </header>
        
        <main className="w-full max-w-4xl bg-white dark:bg-slate-800 rounded-2xl shadow-2xl p-4 sm:p-6 md:p-8">
            {!hasActiveSubscription && (
                <div className="bg-yellow-100 dark:bg-yellow-900/50 border-l-4 border-yellow-500 text-yellow-700 dark:text-yellow-200 p-4 rounded-md mb-6" role="alert">
                    <p className="font-bold">Brak dostępu</p>
                    <p>Nie masz aktywnej subskrypcji. Wykup dostęp w panelu administratora, aby rozpocząć naukę.</p>
                </div>
            )}
            <h2 className="text-2xl font-bold text-blue-700 dark:text-blue-400 mb-6 border-b-2 border-slate-200 dark:border-slate-700 pb-3">Wybierz kategorię</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {categoriesWithCounts.map(({ name, originalName }) => (
                    <button
                        key={originalName}
                        onClick={() => onSelectCategory(originalName)}
                        disabled={!hasActiveSubscription}
                        className="p-4 rounded-lg flex flex-col items-center justify-center text-center transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-slate-800 focus:ring-blue-500 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-600 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                    >
                        {categoryIcons[originalName] || <ShuffleIcon className="w-10 h-10 text-gray-500" />}
                        <span className="mt-3 font-semibold text-sm">{name}</span>
                    </button>
                ))}
            </div>

            <div className="mt-8 pt-6 border-t-2 border-slate-200 dark:border-slate-700 flex flex-col items-center">
                 <h3 className="text-xl font-semibold text-slate-800 dark:text-slate-200 mb-4">Lub wybierz tryb niestandardowy</h3>
                 <button
                    onClick={onCustomStudyClick}
                    disabled={!hasActiveSubscription}
                    className="p-4 rounded-lg flex flex-col items-center justify-center text-center transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-slate-800 focus:ring-blue-500 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-600 shadow-sm w-full sm:w-auto sm:min-w-[220px] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                    <ShuffleIcon className="w-10 h-10 text-green-500" />
                    <span className="mt-3 font-semibold text-sm">Tryb mieszany / Losowy</span>
                </button>
            </div>
        </main>
        
        <footer className="mt-8 text-center text-slate-500 dark:text-slate-400 text-sm space-y-2">
            {currentUser?.login === 'admin' &&
                <button onClick={onAdminClick} className="flex items-center gap-2 mx-auto hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200">
                    <AdminIcon className="w-4 h-4" /> Panel Administratora
                </button>
            }
            <p>Created by Patryk Nowicki</p>
        </footer>
    </div>
  );
};

export default HomeScreen;