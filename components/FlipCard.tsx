

import React, { useLayoutEffect, useRef } from 'react';
import { Flashcard } from '../types';
import { CheckIcon, CloseIcon, SkipIcon } from './icons/MedicalIcons';

type CardStatus = 'known' | 'unknown' | 'skipped' | 'unseen';

// A component that automatically adjusts font-size to fit its content within the container.
// This version uses a robust iterative approach to ensure stability and prevent overflow.
const AutoScalingText: React.FC<{ content: string }> = ({ content }) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const textRef = useRef<HTMLDivElement>(null);
    
    useLayoutEffect(() => {
        const container = containerRef.current;
        const text = textRef.current;
        if (!container || !text) return;

        const scaleText = () => {
            let fontSize = 1.5; // Start with max font size in rem
            text.style.fontSize = `${fontSize}rem`;
            
            const isOverflowing = () => text.scrollHeight > container.clientHeight || text.scrollWidth > container.clientWidth;
            
            // Iteratively shrink font size until it fits.
            // This is done in a loop within a single effect pass to avoid re-renders.
            while (isOverflowing() && fontSize > 0.1) {
                fontSize -= 0.05;
                text.style.fontSize = `${fontSize}rem`;
            }
        };

        scaleText(); // Scale on initial render and content change

        const resizeObserver = new ResizeObserver(scaleText);
        resizeObserver.observe(container);

        return () => resizeObserver.disconnect();
    }, [content]);


    return (
        <div ref={containerRef} className="w-full h-full flex justify-center items-center p-4 sm:p-6 overflow-hidden">
            <div
                ref={textRef}
                className="leading-snug text-center break-words [hyphens:auto] whitespace-pre-line"
            >
                {content}
            </div>
        </div>
    );
};


interface FlipCardProps {
  isFlipped: boolean;
  setIsFlipped: (isFlipped: boolean) => void;
  card: Partial<Flashcard>;
  status: CardStatus;
}

const FlipCard: React.FC<FlipCardProps> = ({ isFlipped, setIsFlipped, card, status }) => {
  const handleFlip = () => setIsFlipped(!isFlipped);

  const mainCategory = card.category?.split(' > ')[0];

  const StatusBadge: React.FC<{ status: CardStatus }> = ({ status }) => {
    if (status === 'unseen') return null;

    const badgeStyles = {
        known: 'bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-300',
        unknown: 'bg-red-100 dark:bg-red-900 text-red-600 dark:text-red-300',
        skipped: 'bg-slate-200 dark:bg-slate-600 text-slate-600 dark:text-slate-300',
    };
    
    const icons = {
        known: <CheckIcon className="w-4 h-4" />,
        unknown: <CloseIcon className="w-4 h-4" />,
        skipped: <SkipIcon className="w-4 h-4" />,
    }

    return (
        <div className={`absolute top-3 right-3 p-1.5 rounded-full z-20 ${badgeStyles[status as keyof typeof badgeStyles]}`}>
            {icons[status as keyof typeof icons]}
        </div>
    );
  };


  return (
    <div className="w-full h-80 sm:h-96 [perspective:1000px]" onClick={handleFlip}>
      <div
        className="relative w-full h-full text-center transition-transform duration-300 [transform-style:preserve-3d]"
        style={{ transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)' }}
      >
        {/* Front of the card */}
        <div className="absolute w-full h-full bg-white dark:bg-slate-800 rounded-2xl shadow-xl flex flex-col justify-center items-center [backface-visibility:hidden]">
          <StatusBadge status={status} />
          <AutoScalingText content={card.question || ''} />
          <div className="absolute bottom-2 left-0 right-0 text-xs text-slate-400 dark:text-slate-500">
            {mainCategory}
          </div>
        </div>

        {/* Back of the card */}
        <div className="absolute w-full h-full bg-blue-100 dark:bg-blue-900/50 rounded-2xl shadow-xl flex flex-col justify-center items-center [backface-visibility:hidden] [transform:rotateY(180deg)]">
          <StatusBadge status={status} />
          <AutoScalingText content={card.answer || ''} />
        </div>
      </div>
    </div>
  );
};

export default FlipCard;