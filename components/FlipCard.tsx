import React, { useRef, useLayoutEffect } from 'react';

// A component that automatically adjusts font-size to fit its content within the container.
const AutoScalingText: React.FC<{ content: string }> = ({ content }) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const textRef = useRef<HTMLDivElement>(null);

    useLayoutEffect(() => {
        const container = containerRef.current;
        const text = textRef.current;

        if (!container || !text) return;

        const resizeText = () => {
            // Further reduced max font size from 30px to 21px based on user feedback for a more balanced aesthetic.
            const maxFontSize = 21; 
            const minFontSize = 14; // Minimum font size in px
            
            let low = minFontSize;
            let high = maxFontSize;
            let optimalSize = minFontSize;

            // This function is performance-sensitive. It modifies style, causing reflow.
            const isOverflowing = (size: number): boolean => {
                text.style.fontSize = `${size}px`;
                // Check if the text's scroll height/width exceeds the container's client height/width.
                return text.scrollHeight > container.clientHeight || text.scrollWidth > container.clientWidth;
            };
            
            // Binary search for the largest font size that fits without overflowing.
            while (low <= high) {
                const mid = Math.floor((low + high) / 2);
                if (isOverflowing(mid)) {
                    high = mid - 1; // Font size is too big, try a smaller size.
                } else {
                    optimalSize = mid; // It fits, try a bigger size to maximize.
                    low = mid + 1;
                }
            }
            
            text.style.fontSize = `${optimalSize}px`;
        };

        // Use ResizeObserver to automatically resize text when the container size changes.
        const observer = new ResizeObserver(resizeText);
        observer.observe(container);

        resizeText(); // Initial resize on mount and content change.

        // Cleanup observer on unmount.
        return () => {
            observer.disconnect();
        };

    }, [content]);

    return (
        <div ref={containerRef} className="w-full h-full flex items-center justify-center p-6 overflow-hidden">
            <div 
                ref={textRef} 
                // The CSS transition was removed. It caused a visual flicker effect 
                // when the font size was being calculated and applied rapidly.
                style={{ 
                    lineHeight: 1.25, 
                    textAlign: 'center', 
                    wordBreak: 'break-word',
                    hyphens: 'auto'
                }}
            >
                {content}
            </div>
        </div>
    );
};


interface FlipCardProps {
  isFlipped: boolean;
  setIsFlipped: (isFlipped: boolean) => void;
  frontContent: string;
  backContent: string;
}

const FlipCard: React.FC<FlipCardProps> = ({ isFlipped, setIsFlipped, frontContent, backContent }) => {
  const handleFlip = () => setIsFlipped(!isFlipped);

  return (
    <div className="w-full h-80 sm:h-96 [perspective:1000px]" onClick={handleFlip}>
      <div
        className="relative w-full h-full [transform-style:preserve-3d] transition-transform duration-700"
        style={{ transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)' }}
      >
        {/* Front of the card */}
        <div className="absolute w-full h-full [backface-visibility:hidden] bg-white dark:bg-slate-800 rounded-2xl shadow-xl flex items-center justify-center text-center cursor-pointer border-4 border-slate-200 dark:border-slate-700">
           <AutoScalingText content={frontContent} />
        </div>
        {/* Back of the card */}
        <div
          className="absolute w-full h-full [backface-visibility:hidden] bg-blue-50 dark:bg-blue-900/70 rounded-2xl shadow-xl flex items-center justify-center text-center cursor-pointer border-4 border-blue-200 dark:border-blue-700"
          style={{ transform: 'rotateY(180deg)' }}
        >
          <AutoScalingText content={backContent} />
        </div>
      </div>
    </div>
  );
};

export default FlipCard;
