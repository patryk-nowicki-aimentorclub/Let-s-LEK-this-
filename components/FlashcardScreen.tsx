

import React, { useState, useCallback, useMemo } from 'react';
import { Flashcard } from '../types';
import FlipCard from './FlipCard';

interface FlashcardScreenProps {
  deck: Flashcard[];
  onFinish: () => void;
}

type SessionState = 'studying' | 'reviewing' | 'finished';

const FlashcardScreen: React.FC<FlashcardScreenProps> = ({ deck, onFinish }) => {
  const [sessionState, setSessionState] = useState<SessionState>('studying');
  const [reviewPool, setReviewPool] = useState<Set<string>>(new Set());
  const [knownCards, setKnownCards] = useState<Set<string>>(new Set());

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const studyDeck = useMemo(() => {
    if (sessionState === 'reviewing') {
      return deck.filter(card => reviewPool.has(card.id));
    }
    return deck;
  }, [deck, sessionState, reviewPool]);


  const handleMark = useCallback((status: 'known' | 'unknown') => {
    if (isProcessing || studyDeck.length === 0) return;

    setIsProcessing(true);
    const cardId = studyDeck[currentIndex].id;

    setIsFlipped(false);

    setTimeout(() => {
        // --- Calculate next state for pools ---
        const isKnown = status === 'known';
        const newKnownCards = new Set(knownCards);
        const newReviewPool = new Set(reviewPool);

        if (isKnown) {
            newKnownCards.add(cardId);
            newReviewPool.delete(cardId);
        } else {
            newKnownCards.delete(cardId);
            newReviewPool.add(cardId);
        }
        
        // --- Atomically update state ---
        setKnownCards(newKnownCards);
        setReviewPool(newReviewPool);

        // --- Handle navigation based on the calculated new state ---
        if (sessionState === 'studying') {
            if (currentIndex >= deck.length - 1) { // End of initial deck
                if (newReviewPool.size > 0) {
                    setSessionState('reviewing');
                    setCurrentIndex(0);
                } else {
                    onFinish();
                }
            } else {
                setCurrentIndex(c => c + 1);
            }
        } else { // 'reviewing'
            if (isKnown) {
                // Card was marked known and removed from review pool
                if (newReviewPool.size === 0) {
                    onFinish();
                } else {
                    // Adjust index if we were at the end of the shrinking list
                    if (currentIndex >= newReviewPool.size) {
                        setCurrentIndex(0);
                    }
                    // Otherwise, index remains correct, automatically showing the next item
                }
            } else {
                // Card marked unknown, stays in review. Cycle to the next one.
                setCurrentIndex(c => (c + 1) % studyDeck.length);
            }
        }

        setIsProcessing(false);
    }, 250); // Delay allows for flip animation and prevents double clicks
  }, [currentIndex, deck, sessionState, onFinish, isProcessing, reviewPool, knownCards, studyDeck.length]);


  const handlePrev = () => {
     if (isProcessing || currentIndex === 0) return;
     setIsProcessing(true);
     setIsFlipped(false);
     setTimeout(() => {
        setCurrentIndex(prev => prev - 1);
        setIsProcessing(false);
     }, 150);
  };


  const currentCard = studyDeck[currentIndex];
  const progress = studyDeck.length > 0 ? ((currentIndex + 1) / studyDeck.length) * 100 : 0;
  
  const headerText = sessionState === 'reviewing' 
    ? `Sesja Powtórkowa (${studyDeck.length} kart)`
    : `Sesja Fiszki`;

  if (!currentCard) {
    // This can happen briefly during state transition, or when the deck is empty.
    // If the session state isn't finished yet, it's a transient state. Let's wait.
    // If it persists, it means the session is over.
    if (sessionState !== 'finished') {
        // A simple fix for transient empty deck is to call onFinish if there are no more cards to review
        if (sessionState === 'reviewing' && reviewPool.size === 0) {
            onFinish();
        }
    }
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4 text-center">
        <h2 className="text-3xl font-bold text-blue-500 dark:text-blue-400 mb-4">Gratulacje! Sesja ukończona.</h2>
        <button onClick={onFinish} className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg">
          Powrót do menu
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center p-4 sm:p-6 overflow-hidden">
        <div className="w-full max-w-4xl z-10">
            <header className="flex justify-between items-center mb-4 pr-24">
                <button onClick={onFinish} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-600 font-semibold transition-colors duration-200 text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-offset-slate-900">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                    Zakończ sesję
                </button>
                <div className="text-lg font-bold text-blue-600 dark:text-blue-400">
                    {headerText}
                </div>
                <div className="text-lg font-bold text-slate-600 dark:text-slate-300">
                    {currentIndex + 1} / {studyDeck.length}
                </div>
            </header>

            <div className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-full mb-2">
                <div className="h-2 bg-blue-600 dark:bg-blue-500 rounded-full" style={{ width: `${progress}%` }}></div>
            </div>
            
            <div className="flex justify-center gap-8 mb-4 text-lg">
                <div className="flex items-center gap-2">
                    <span className="font-semibold text-green-600 dark:text-green-400">Znam:</span>
                    <span className="font-bold text-slate-800 dark:text-slate-200 text-xl font-mono tabular-nums">{knownCards.size}</span>
                </div>
                <div className="flex items-center gap-2">
                    <span className="font-semibold text-red-600 dark:text-red-400">Nie znam:</span>
                    <span className="font-bold text-slate-800 dark:text-slate-200 text-xl font-mono tabular-nums">{reviewPool.size}</span>
                </div>
            </div>

            <FlipCard
                key={currentCard.id}
                isFlipped={isFlipped}
                setIsFlipped={setIsFlipped}
                card={currentCard}
            />

            <div className="flex justify-center items-center gap-4 mt-6">
                <button 
                  onClick={() => handleMark('unknown')} 
                  disabled={isProcessing}
                  className="text-white font-bold py-4 px-8 rounded-full text-lg transition-all transform hover:scale-110 shadow-lg bg-red-600 hover:bg-red-700 disabled:opacity-50 disabled:cursor-wait"
                >
                  Nie znam
                </button>
                <button 
                  onClick={() => handleMark('known')} 
                  disabled={isProcessing}
                  className="text-white font-bold py-4 px-8 rounded-full text-lg transition-all transform hover:scale-110 shadow-lg bg-green-600 hover:bg-green-700 disabled:opacity-50 disabled:cursor-wait"
                >
                  Znam
                </button>
            </div>
             {sessionState === 'reviewing' && (
                <p className="text-center mt-4 text-sm text-blue-600 dark:text-blue-400 italic">
                    Powtarzasz pytania, które sprawiły Ci trudność. Sesja zakończy się, gdy na wszystkie odpowiesz "Znam".
                </p>
            )}
        </div>
    </div>
  );
};

export default FlashcardScreen;