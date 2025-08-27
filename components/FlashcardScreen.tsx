

import React, { useState, useCallback, useMemo } from 'react';
import { Flashcard } from '../types';
import FlipCard from './FlipCard';
import { SkipIcon, CheckIcon, CloseIcon } from './icons/MedicalIcons';

interface FlashcardScreenProps {
  deck: Flashcard[];
  onFinish: () => void;
}

type SessionState = 'studying' | 'reviewing' | 'finished';
type CardStatus = 'known' | 'unknown' | 'skipped' | 'unseen';


const FlashcardScreen: React.FC<FlashcardScreenProps> = ({ deck, onFinish }) => {
  const [sessionState, setSessionState] = useState<SessionState>('studying');
  const [reviewPool, setReviewPool] = useState<Set<string>>(new Set());
  const [knownCards, setKnownCards] = useState<Set<string>>(new Set());
  const [skippedCards, setSkippedCards] = useState<Set<string>>(new Set());

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  
  const [paginationPage, setPaginationPage] = useState(0);
  const CARDS_PER_PAGE = 30;


  const studyDeck = useMemo(() => {
    if (sessionState === 'reviewing') {
      const reviewIds = new Set([...reviewPool, ...skippedCards]);
      return deck.filter(card => reviewIds.has(card.id));
    }
    return deck;
  }, [deck, sessionState, reviewPool, skippedCards]);


  const handleMark = useCallback((status: 'known' | 'unknown') => {
    if (isProcessing || !studyDeck[currentIndex]) return;

    setIsProcessing(true);
    const cardId = studyDeck[currentIndex].id;

    setIsFlipped(false);

    setTimeout(() => {
        const newKnownCards = new Set(knownCards);
        const newReviewPool = new Set(reviewPool);
        const newSkippedCards = new Set(skippedCards);

        newSkippedCards.delete(cardId);

        if (status === 'known') {
            newKnownCards.add(cardId);
            newReviewPool.delete(cardId);
        } else { // unknown
            newKnownCards.delete(cardId);
            newReviewPool.add(cardId);
        }
        
        setKnownCards(newKnownCards);
        setReviewPool(newReviewPool);
        setSkippedCards(newSkippedCards);

        if (sessionState === 'studying') {
            if (currentIndex >= deck.length - 1) { // End of initial deck
                if (newReviewPool.size > 0 || newSkippedCards.size > 0) {
                    setSessionState('reviewing');
                    setCurrentIndex(0);
                } else {
                    onFinish();
                }
            } else {
                setCurrentIndex(c => c + 1);
            }
        } else { // 'reviewing'
            if (status === 'known') {
                 if (newReviewPool.size === 0 && newSkippedCards.size === 0) {
                    onFinish();
                } else {
                    const newIndex = Math.min(currentIndex, (newReviewPool.size + newSkippedCards.size) - 1);
                    setCurrentIndex(newIndex < 0 ? 0 : newIndex);
                }
            } else {
                setCurrentIndex(c => (c + 1) % studyDeck.length);
            }
        }

        setIsProcessing(false);
    }, 250);
  }, [currentIndex, deck, sessionState, onFinish, isProcessing, reviewPool, knownCards, skippedCards, studyDeck]);

  const handleNavigation = (direction: 'next' | 'prev') => {
    if (isProcessing || !studyDeck[currentIndex]) return;
    setIsProcessing(true);
    setIsFlipped(false);

    if (direction === 'next') {
        const cardIdToPotentiallySkip = studyDeck[currentIndex].id;
        if (!knownCards.has(cardIdToPotentiallySkip) && !reviewPool.has(cardIdToPotentiallySkip)) {
            setSkippedCards(prevSkipped => new Set(prevSkipped).add(cardIdToPotentiallySkip));
        }
    }
    
    setTimeout(() => {
        if (direction === 'next') {
            const nextIndex = currentIndex + 1;
            if (nextIndex < studyDeck.length) {
                setCurrentIndex(nextIndex);
            } else if (sessionState === 'studying' && (reviewPool.size > 0 || skippedCards.size > 0)) {
                setSessionState('reviewing');
                setCurrentIndex(0);
            } else if (nextIndex >= studyDeck.length) {
                onFinish();
            }
        } else {
            setCurrentIndex(prev => Math.max(prev - 1, 0));
        }
        setIsProcessing(false);
    }, 150);
  };
  
  const handleNext = () => handleNavigation('next');
  const handlePrev = () => handleNavigation('prev');


  const currentCard = studyDeck[currentIndex];
  const progress = studyDeck.length > 0 ? ((currentIndex + 1) / studyDeck.length) * 100 : 0;
  
  const headerText = sessionState === 'reviewing' 
    ? `Sesja Powtórkowa (${studyDeck.length} kart)`
    : `Sesja Fiszki`;
    
  const totalSkipped = skippedCards.size;

  const getCardStatus = (cardId: string): CardStatus => {
    if (knownCards.has(cardId)) return 'known';
    if (reviewPool.has(cardId)) return 'unknown';
    if (skippedCards.has(cardId)) return 'skipped';
    return 'unseen';
  };

  const handleJumpToCard = (originalDeckIndex: number) => {
    if (isProcessing) return;
    
    const cardId = deck[originalDeckIndex].id;
    let targetIndex = -1;

    if (sessionState === 'reviewing') {
        const reviewIds = new Set([...reviewPool, ...skippedCards]);
        if (reviewIds.has(cardId)) {
            targetIndex = studyDeck.findIndex(card => card.id === cardId);
        } else {
            // Switch to studying mode to show the card
            setSessionState('studying');
            targetIndex = originalDeckIndex; 
        }
    } else {
        targetIndex = originalDeckIndex;
    }

    if (targetIndex !== -1) {
        setIsProcessing(true);
        setIsFlipped(false);
        setTimeout(() => {
            setCurrentIndex(targetIndex);
            setIsProcessing(false);
        }, 150);
    }
  };

  if (!currentCard) {
    if (sessionState !== 'finished') {
        if (reviewPool.size === 0 && skippedCards.size === 0) {
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
  
  const totalPages = Math.ceil(deck.length / CARDS_PER_PAGE);
  const handlePrevPage = () => setPaginationPage(p => Math.max(0, p - 1));
  const handleNextPage = () => setPaginationPage(p => Math.min(totalPages - 1, p + 1));


  return (
    <div className="min-h-screen flex flex-col items-center p-2 sm:p-6 overflow-hidden">
        <div className="w-full max-w-4xl z-10">
            <header className="flex flex-wrap justify-between items-center gap-2 mb-4">
                <button onClick={onFinish} className="inline-flex items-center gap-2 pl-2 pr-4 py-2 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-600 font-semibold transition-colors duration-200 text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-offset-slate-900">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                    <span className="hidden sm:inline">Zakończ sesję</span>
                </button>
                <div className="text-base sm:text-lg font-bold text-blue-600 dark:text-blue-400">
                    {headerText}
                </div>
                <div className="text-base sm:text-lg font-bold text-slate-600 dark:text-slate-300 mr-12 sm:mr-0">
                    {currentIndex + 1} / {studyDeck.length}
                </div>
            </header>

            <div className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-full mb-2">
                <div className="h-2 bg-blue-600 dark:bg-blue-500 rounded-full" style={{ width: `${progress}%` }}></div>
            </div>
            
            <div className="flex justify-center gap-4 sm:gap-8 mb-4 text-base sm:text-lg">
                <div className="flex items-center gap-2">
                    <span className="font-semibold text-green-600 dark:text-green-400">Znam:</span>
                    <span className="font-bold text-slate-800 dark:text-slate-200 text-xl font-mono tabular-nums">{knownCards.size}</span>
                </div>
                <div className="flex items-center gap-2">
                    <span className="font-semibold text-red-600 dark:text-red-400">Nie znam:</span>
                    <span className="font-bold text-slate-800 dark:text-slate-200 text-xl font-mono tabular-nums">{reviewPool.size}</span>
                </div>
                 <div className="flex items-center gap-2">
                    <SkipIcon className="w-5 h-5 text-slate-500 dark:text-slate-400" />
                    <span className="font-semibold text-slate-500 dark:text-slate-400">Pominięte:</span>
                    <span className="font-bold text-slate-800 dark:text-slate-200 text-xl font-mono tabular-nums">{totalSkipped}</span>
                </div>
            </div>

            <FlipCard
                key={currentCard.id}
                isFlipped={isFlipped}
                setIsFlipped={setIsFlipped}
                card={currentCard}
                status={getCardStatus(currentCard.id)}
            />

            <div className="grid grid-cols-[auto_1fr_auto] sm:flex sm:justify-center items-center gap-3 sm:gap-4 mt-4 sm:mt-6">
                <button
                    onClick={handlePrev}
                    disabled={isProcessing || currentIndex === 0}
                    className="bg-slate-200 hover:bg-slate-300 dark:bg-slate-600 dark:hover:bg-slate-700 text-slate-800 dark:text-white font-bold py-2 px-4 sm:py-3 sm:px-5 rounded-full text-sm transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    Poprzedni
                </button>
                <div className="flex justify-center items-center gap-3 sm:gap-4">
                    <button
                        onClick={() => handleMark('unknown')}
                        disabled={isProcessing}
                        className="flex items-center justify-center text-center text-white font-bold rounded-full text-sm sm:text-base transition-all transform hover:scale-105 shadow-lg bg-red-600 hover:bg-red-700 disabled:opacity-50 disabled:cursor-wait px-8 py-3 sm:px-10 sm:py-4"
                    >
                        Nie znam
                    </button>
                    <button
                        onClick={() => handleMark('known')}
                        disabled={isProcessing}
                        className="flex items-center justify-center text-center text-white font-bold rounded-full text-sm sm:text-base transition-all transform hover:scale-105 shadow-lg bg-green-600 hover:bg-green-700 disabled:opacity-50 disabled:cursor-wait px-8 py-3 sm:px-10 sm:py-4"
                    >
                        Znam
                    </button>
                </div>
                <button
                    onClick={handleNext}
                    disabled={isProcessing || (sessionState === 'studying' && currentIndex >= studyDeck.length - 1 && reviewPool.size === 0 && skippedCards.size === 0) || (sessionState === 'reviewing' && currentIndex >= studyDeck.length - 1)}
                    className="bg-slate-200 hover:bg-slate-300 dark:bg-slate-600 dark:hover:bg-slate-700 text-slate-800 dark:text-white font-bold py-2 px-4 sm:py-3 sm:px-5 rounded-full text-sm transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    Następny
                </button>
            </div>
             {sessionState === 'reviewing' && (
                <p className="text-center mt-4 text-sm text-blue-600 dark:text-blue-400 italic">
                    Powtarzasz pytania, które sprawiły Ci trudność lub zostały pominięte. Sesja zakończy się, gdy na wszystkie odpowiesz "Znam".
                </p>
            )}

            {deck.length > 0 && (
                <div className="mt-8 flex flex-col items-center gap-2">
                     <div className="grid grid-cols-10 gap-2 w-full max-w-lg">
                        {deck.slice(paginationPage * CARDS_PER_PAGE, (paginationPage + 1) * CARDS_PER_PAGE)
                            .map((card, index) => {
                                const originalIndex = (paginationPage * CARDS_PER_PAGE) + index;
                                const status = getCardStatus(card.id);
                                const isCurrent = card.id === currentCard.id;

                                const statusClasses = {
                                    known: 'bg-green-500 hover:bg-green-600 text-white',
                                    unknown: 'bg-red-500 hover:bg-red-600 text-white',
                                    skipped: 'bg-slate-400 hover:bg-slate-500 dark:bg-slate-600 dark:hover:bg-slate-500',
                                    unseen: 'bg-slate-200 hover:bg-slate-300 dark:bg-slate-700 dark:hover:bg-slate-600',
                                };

                                return (
                                    <button
                                        key={card.id}
                                        onClick={() => handleJumpToCard(originalIndex)}
                                        aria-label={`Przejdź do fiszki numer ${originalIndex + 1}`}
                                        className={`relative w-10 h-10 flex items-center justify-center rounded-md font-mono text-xs transition-all ${statusClasses[status]} ${isCurrent ? 'ring-2 ring-blue-500 ring-offset-2 dark:ring-offset-slate-900' : ''}`}
                                    >
                                        {originalIndex + 1}
                                        {status === 'known' && <CheckIcon className="absolute top-0 right-0 w-3 h-3 -mt-1 -mr-1 text-white bg-green-700 rounded-full p-0.5" />}
                                        {status === 'unknown' && <CloseIcon className="absolute top-0 right-0 w-3 h-3 -mt-1 -mr-1 text-white bg-red-700 rounded-full p-0.5" />}
                                        {status === 'skipped' && <SkipIcon className="absolute top-0 right-0 w-3 h-3 -mt-1 -mr-1 text-white bg-slate-600 rounded-full p-0.5" />}
                                    </button>
                                );
                            })}
                    </div>
                    {totalPages > 1 && (
                        <div className="flex justify-center items-center gap-4 mt-2">
                            <button onClick={handlePrevPage} disabled={paginationPage === 0} className="px-4 py-2 bg-slate-200 dark:bg-slate-700 rounded-md disabled:opacity-50 text-sm font-semibold">
                                Poprzednie 30
                            </button>
                            <span className="text-sm text-slate-600 dark:text-slate-400 font-mono">
                                {paginationPage + 1} / {totalPages}
                            </span>
                            <button onClick={handleNextPage} disabled={paginationPage >= totalPages - 1} className="px-4 py-2 bg-slate-200 dark:bg-slate-700 rounded-md disabled:opacity-50 text-sm font-semibold">
                                Następne 30
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>
    </div>
  );
};

export default FlashcardScreen;