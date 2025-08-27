
import React, { useState, useMemo } from 'react';
import { useFlashcards } from '../hooks/useFlashcards';
import { Flashcard } from '../types';

interface CustomStudyScreenProps {
  onStartStudy: (deck: Flashcard[]) => void;
  onBack: () => void;
}

const CustomStudyScreen: React.FC<CustomStudyScreenProps> = ({ onStartStudy, onBack }) => {
  const { flashcards, categories } = useFlashcards();
  
  const [selectedBases, setSelectedBases] = useState<Record<string, Set<string>>>({});

  const basesByCategory = useMemo(() => {
    const grouped: Record<string, string[]> = {};
    flashcards.forEach(fc => {
      if (!grouped[fc.category]) {
        grouped[fc.category] = [];
      }
      if (!grouped[fc.category].includes(fc.base)) {
        grouped[fc.category].push(fc.base);
      }
    });
    for (const category in grouped) {
      grouped[category].sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));
    }
    return grouped;
  }, [flashcards]);

  const handleBaseToggle = (category: string, base: string) => {
    setSelectedBases(prev => {
      const newSelections = { ...prev };
      const categorySet = new Set(newSelections[category] || []);
      
      if (categorySet.has(base)) {
        categorySet.delete(base);
      } else {
        categorySet.add(base);
      }

      if (categorySet.size === 0) {
        delete newSelections[category];
      } else {
        newSelections[category] = categorySet;
      }
      
      return newSelections;
    });
  };

  const handleCategoryToggle = (category: string, isChecked: boolean) => {
    setSelectedBases(prev => {
        const newSelections = { ...prev };
        if (isChecked) {
            newSelections[category] = new Set(basesByCategory[category]);
        } else {
            delete newSelections[category];
        }
        return newSelections;
    });
  };
  
  const selectedFlashcardsCount = useMemo(() => {
    const selectionSet = new Set<string>();
    Object.entries(selectedBases).forEach(([category, bases]) => {
        bases.forEach(base => selectionSet.add(`${category}::${base}`));
    });

    if (selectionSet.size === 0) return 0;
    
    return flashcards.filter(fc => selectionSet.has(`${fc.category}::${fc.base}`)).length;
  }, [selectedBases, flashcards]);

  const handleStartCustomStudy = () => {
    const selectionSet = new Set<string>();
     Object.entries(selectedBases).forEach(([category, bases]) => {
        bases.forEach(base => selectionSet.add(`${category}::${base}`));
    });

    if (selectionSet.size === 0) {
        alert("Proszę wybrać przynajmniej jedną bazę pytań.");
        return;
    }
    
    const deck = flashcards.filter(fc => selectionSet.has(`${fc.category}::${fc.base}`));
    onStartStudy(deck);
  };
  
  const shuffleArray = (array: Flashcard[]): Flashcard[] => {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
  };

  const handleStartRandomStudy = (count: number) => {
    if (flashcards.length < count) {
      alert(`W bazie jest tylko ${flashcards.length} fiszek. Nie można wylosować ${count}.`);
      return;
    }
    const shuffled = shuffleArray(flashcards);
    const deck = shuffled.slice(0, count);
    onStartStudy(deck);
  };

  const randomCounts = [50, 100, 150, 200, 250, 300, 350, 400, 450, 500];

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 sm:p-6">
      <main className="w-full max-w-4xl bg-white dark:bg-slate-800 rounded-2xl shadow-2xl p-6 sm:p-8">
        <header className="mb-6 border-b-2 border-slate-200 dark:border-slate-700 pb-4">
          <button onClick={onBack} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-600 font-semibold transition-colors duration-200 text-sm mb-4 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-offset-slate-800">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Wróć do ekranu głównego
          </button>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
            Tryb <span className="text-blue-600 dark:text-blue-500">mieszany / losowy</span>
          </h1>
        </header>

        <section className="mb-8">
          <h2 className="text-2xl font-bold text-blue-700 dark:text-blue-400 mb-4">Stwórz własny zestaw</h2>
          <p className="text-slate-600 dark:text-slate-400 mb-6">Wybierz kategorie i bazy pytań, z których chcesz się uczyć.</p>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-[40vh] overflow-y-auto pr-2">
            {categories.map(category => {
              const allBasesInCategory = basesByCategory[category] || [];
              const selectedBasesInCategory = selectedBases[category] || new Set();
              const isCategoryChecked = allBasesInCategory.length > 0 && selectedBasesInCategory.size === allBasesInCategory.length;
              const isIndeterminate = selectedBasesInCategory.size > 0 && selectedBasesInCategory.size < allBasesInCategory.length;

              return (
                <div key={category} className="bg-slate-50 dark:bg-slate-900/50 p-4 rounded-lg">
                  <div className="flex items-center">
                    <input
                      id={`cat-${category}`}
                      type="checkbox"
                      className="h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                      checked={isCategoryChecked}
                      ref={el => {
                        if (el) {
                          el.indeterminate = isIndeterminate;
                        }
                      }}
                      onChange={(e) => handleCategoryToggle(category, e.target.checked)}
                      disabled={allBasesInCategory.length === 0}
                    />
                    <label htmlFor={`cat-${category}`} className="ml-3 text-lg font-semibold text-slate-800 dark:text-slate-200 cursor-pointer">{category}</label>
                  </div>
                  {(allBasesInCategory.length > 0) && (
                    <div className="mt-3 pl-8 grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-2">
                      {allBasesInCategory.map(base => (
                        <div key={base} className="flex items-center">
                           <input
                            id={`base-${category}-${base}`}
                            type="checkbox"
                            className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                            checked={selectedBasesInCategory.has(base)}
                            onChange={() => handleBaseToggle(category, base)}
                          />
                          <label htmlFor={`base-${category}-${base}`} className="ml-2 text-sm text-slate-600 dark:text-slate-300 cursor-pointer">{base}</label>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="mt-6 flex items-center gap-4">
            <button onClick={handleStartCustomStudy} disabled={selectedFlashcardsCount === 0} className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition-colors disabled:bg-slate-400 dark:disabled:bg-slate-600 disabled:cursor-not-allowed">
              Rozpocznij naukę ({selectedFlashcardsCount} fiszek)
            </button>
          </div>
        </section>
        
        <section className="border-t-2 border-slate-200 dark:border-slate-700 pt-6 mt-8">
          <h2 className="text-2xl font-bold text-blue-700 dark:text-blue-400 mb-4">Wylosuj fiszki ze wszystkich</h2>
           <p className="text-slate-600 dark:text-slate-400 mb-6">Wybierz liczbę pytań do losowej sesji ze wszystkich dostępnych kategorii i baz.</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
            {randomCounts.map(count => (
              flashcards.length >= count && (
                <button
                  key={count}
                  onClick={() => handleStartRandomStudy(count)}
                  className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg transition-colors"
                >
                  {count}
                </button>
              )
            ))}
          </div>
        </section>
      </main>
    </div>
  );
};

export default CustomStudyScreen;