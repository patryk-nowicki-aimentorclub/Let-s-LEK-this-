
import React, { useMemo } from 'react';
import { useFlashcards } from '../hooks/useFlashcards';
import { Flashcard } from '../types';

interface BaseSelectionScreenProps {
  category: string;
  onStartStudy: (deck: Flashcard[]) => void;
  onBack: () => void;
}

const BaseSelectionScreen: React.FC<BaseSelectionScreenProps> = ({ category, onStartStudy, onBack }) => {
  const { flashcards } = useFlashcards();

  const bases = useMemo(() => {
    const categoryFlashcards = flashcards.filter(fc => fc.category === category);
    const baseCounts: { [key: string]: number } = {};
    categoryFlashcards.forEach(fc => {
        baseCounts[fc.base] = (baseCounts[fc.base] || 0) + 1;
    });
    return Object.entries(baseCounts).map(([name, count]) => ({ name, count }));
  }, [flashcards, category]);

  const handleSelectBase = (baseName: string) => {
    const deck = flashcards.filter(fc => fc.category === category && fc.base === baseName);
    onStartStudy(deck);
  };
  
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 sm:p-6">
        <main className="w-full max-w-2xl bg-white dark:bg-slate-800 rounded-2xl shadow-2xl p-6 sm:p-8">
            <header className="mb-6 border-b-2 border-slate-200 dark:border-slate-700 pb-4">
                 <button onClick={onBack} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-600 font-semibold transition-colors duration-200 text-sm mb-4 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-offset-slate-800">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                    Wróć do kategorii
                </button>
                <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
                    Kategoria: <span className="text-blue-600 dark:text-blue-500">{category}</span>
                </h1>
                <p className="mt-1 text-slate-600 dark:text-slate-400">Wybierz bazę pytań, aby rozpocząć naukę.</p>
            </header>
            
            {bases.length > 0 ? (
                 <ul className="space-y-3">
                    {bases.map(({ name, count }) => (
                        <li key={name}>
                            <button
                                onClick={() => handleSelectBase(name)}
                                className="w-full text-left p-4 rounded-lg flex items-center justify-between transition-all duration-200 bg-slate-100 dark:bg-slate-700 hover:bg-blue-100 dark:hover:bg-blue-900/50 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-slate-800 focus:ring-blue-500"
                            >
                                <span className="font-semibold text-lg text-slate-800 dark:text-slate-100">{name}</span>
                                <span className="text-sm font-medium bg-blue-200 dark:bg-blue-800 text-blue-800 dark:text-blue-200 py-1 px-3 rounded-full">
                                    {count} {count === 1 ? 'pytanie' : (count > 1 && count < 5) ? 'pytania' : 'pytań'}
                                </span>
                            </button>
                        </li>
                    ))}
                </ul>
            ) : (
                <p className="text-center text-slate-500 dark:text-slate-400 py-8">
                    Brak baz pytań w tej kategorii.
                </p>
            )}
        </main>
    </div>
  );
};

export default BaseSelectionScreen;