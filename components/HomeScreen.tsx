
import React, { useMemo } from 'react';
import { useFlashcards } from '../hooks/useFlashcards';
import { useTheme } from '../hooks/useTheme';
import { 
    ShuffleIcon,
    InternalMedicineIcon, PediatricsIcon, SurgeryIcon, GynecologyIcon,
    FamilyMedicineIcon, PsychiatryIcon, EmergencyMedicineIcon,
    BioethicsIcon, PublicHealthIcon, JurisprudenceIcon
} from './icons/MedicalIcons';

interface HomeScreenProps {
  onSelectCategory: (category: string) => void;
  onAdminClick: () => void;
  onCustomStudyClick: () => void;
}

const HomeScreen: React.FC<HomeScreenProps> = ({ onSelectCategory, onAdminClick, onCustomStudyClick }) => {
  const { flashcards, categories } = useFlashcards();

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
    "Choroby wewnętrzne": <InternalMedicineIcon className="w-10 h-10 text-blue-500" />,
    "Pediatria": <PediatricsIcon className="w-10 h-10 text-sky-500" />,
    "Chirurgia": <SurgeryIcon className="w-10 h-10 text-blue-500" />,
    "Ginekologia": <GynecologyIcon className="w-10 h-10 text-sky-500" />,
    "Medycyna rodzinna": <FamilyMedicineIcon className="w-10 h-10 text-blue-500" />,
    "Psychiatria": <PsychiatryIcon className="w-10 h-10 text-sky-500" />,
    "Medycyna ratunkowa i anestezjologia": <EmergencyMedicineIcon className="w-10 h-10 text-blue-500" />,
    "Bioetyka i prawo medyczne": <BioethicsIcon className="w-10 h-10 text-sky-500" />,
    "Zdrowie publiczne": <PublicHealthIcon className="w-10 h-10 text-blue-500" />,
    "Orzecznictwo": <JurisprudenceIcon className="w-10 h-10 text-sky-500" />
  }), []);


  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 sm:p-6">
        <header className="text-center mb-8">
            <h1 className="text-5xl sm:text-6xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                Let's <span className="text-blue-600 dark:text-blue-500">LEK</span> this!
            </h1>
            <p className="mt-2 text-lg text-slate-600 dark:text-slate-400">Twoje interaktywne fiszki do egzaminu LEK</p>
        </header>
        
        <main className="w-full max-w-4xl bg-white dark:bg-slate-800 rounded-2xl shadow-2xl p-6 sm:p-8">
            <h2 className="text-2xl font-bold text-blue-700 dark:text-blue-400 mb-6 border-b-2 border-slate-200 dark:border-slate-700 pb-3">Wybierz kategorię</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {categoriesWithCounts.map(({ name, originalName }) => (
                    <button
                        key={originalName}
                        onClick={() => onSelectCategory(originalName)}
                        className="p-4 rounded-lg flex flex-col items-center justify-center text-center transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-slate-800 focus:ring-blue-500 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-600 shadow-sm"
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
                    className="p-4 rounded-lg flex flex-col items-center justify-center text-center transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-slate-800 focus:ring-blue-500 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-600 shadow-sm w-full sm:w-auto sm:min-w-[220px]"
                >
                    <ShuffleIcon className="w-10 h-10 text-green-500" />
                    <span className="mt-3 font-semibold text-sm">Tryb mieszany / Losowy</span>
                </button>
            </div>
        </main>
        
        <footer className="mt-8 text-center text-slate-500 dark:text-slate-400 text-sm space-y-2">
            <button onClick={onAdminClick} className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200">
                Panel Administratora
            </button>
            <p>Created by Patryk Nowicki</p>
        </footer>
    </div>
  );
};

export default HomeScreen;