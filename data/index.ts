import { Flashcard } from '../types';
import { v4 as uuidv4 } from 'uuid';
import { orzecznictwoNew, RawFlashcardWithOptions } from './orzecznictwo-new';
import { orzecznictwo as orzecznictwoBaza1 } from './orzecznictwo';
import { interna } from './interna';
import { interna2 } from './interna2';
import { pediatria } from './pediatria';
import { pediatria2 } from './pediatria2';
import { chirurgia } from './chirurgia';
import { chirurgia2 } from './chirurgia2';
import { ginekologia } from './ginekologia';
import { ginekologia2 } from './ginekologia2';
import { medycynaRodzinna } from './medycyna-rodzinna';
import { medycynaRodzinna2 } from './medycyna-rodzinna2';
import { psychiatria } from './psychiatria';
import { psychiatria2 } from './psychiatria2';
import { medycynaRatunkowa } from './medycyna-ratunkowa';
import { medycynaRatunkowa2 } from './medycyna-ratunkowa2';
import { bioetyka } from './bioetyka';
import { bioetyka2 } from './bioetyka2';
import { zdrowiePubliczne } from './zdrowie-publiczne';
import { zdrowiePubliczne2 } from './zdrowie-publiczne2';

/**
 * This file serves as the central point for aggregating all hardcoded flashcard databases.
 * When a new database file (e.g., `internalMedicine.ts`) is created in this directory,
 * it should be imported and used with the processing function below.
 */

// This type represents a flashcard before a unique ID and creation date are added.
type RawFlashcard = Omit<Flashcard, 'id' | 'createdAt'>;

/**
 * Processes raw flashcard data with complex options into a standardized format.
 * - Handles "niejasna" (unclear) status.
 * - Expands answers like "wszystkie odpowiedzi" (all answers) to list all other options.
 * - Expands answers referencing other options like "prawdziwe są odpowiedzi A i B" (answers A and B are correct).
 * @param rawData The raw flashcard data array.
 * @param categoryName The category to assign to all processed flashcards.
 * @param baseName The base name to assign to all processed flashcards.
 * @returns An array of processed RawFlashcard objects.
 */
const processRawFlashcardsWithOptions = (rawData: RawFlashcardWithOptions[], categoryName: string, baseName: string): RawFlashcard[] => {
  return rawData.map((item: RawFlashcardWithOptions): RawFlashcard => {
    // Special case for the specific flashcard from medycyna-rodzinna2.ts
    if (categoryName === "Medycyna rodzinna" && baseName === "Baza 2" && item.index === 60) {
      return {
        question: item.question,
        answer: "wszystkie wymienione (1. bóle gardła 2. bezgłos 3. świszczący oddech 4. bóle w klatce piersiowej 5. zapalenie dziąseł)",
        category: categoryName,
        base: baseName,
        subCategory: item.category.replace(' > ', ' '),
      };
    }

    const correctOptions = item.options.filter(opt => opt.status !== null);

    const answerParts = correctOptions.map(correctOpt => {
      let baseAnswerText = correctOpt.text;
      if (correctOpt.status === 'niejasna') {
        baseAnswerText += ' (Pytanie wątpliwie)';
      }

      const allAnswersRegex = /wszystkie (odpowiedzi|poprawne|prawidłowe|wymienione|powyższe|wyżej wymienione)|wszystkich .*wymienionych|wszystkie .*prawdziwe/i;
      const combinedAnswerRegex = /prawdziwe są odpowiedzi|prawdziwa jest odpowiedź/i;

      // Handle "all answers" type responses
      if (allAnswersRegex.test(correctOpt.text)) {
        const allOtherOptionsText = item.options
          .filter(opt => opt.letter !== correctOpt.letter)
          .map(opt => `${opt.letter}) ${opt.text}`)
          .join('\n\n');
        
        return allOtherOptionsText ? `${baseAnswerText}\n\n${allOtherOptionsText}` : baseAnswerText;
      }
      
      // Handle "A+B" type responses
      if (combinedAnswerRegex.test(correctOpt.text)) {
        const referencedLetters = correctOpt.text.match(/[A-E]/g);
        if (referencedLetters && referencedLetters.length > 0) {
          const referencedOptionsText = referencedLetters
            .map(letter => {
              const referencedOpt = item.options.find(opt => opt.letter === letter);
              return referencedOpt ? `${letter}) ${referencedOpt.text}` : '';
            })
            .filter(Boolean)
            .join('\n\n');
          
          return referencedOptionsText ? `${baseAnswerText}\n\n${referencedOptionsText}` : baseAnswerText;
        }
      }
      
      return baseAnswerText;
    });

    const answer = answerParts.join('\n\n');

    return {
      question: item.question,
      answer: answer,
      category: categoryName,
      base: baseName,
      subCategory: item.category.replace(' > ', ' '),
    };
  });
};


// The main array to hold all flashcards from different database files.
const allRawFlashcards: RawFlashcard[] = [
    ...processRawFlashcardsWithOptions(orzecznictwoNew, "Orzecznictwo", "Baza 3"),
    ...processRawFlashcardsWithOptions(orzecznictwoBaza1, "Orzecznictwo", "Baza 1"),
    ...processRawFlashcardsWithOptions(interna, "Interna", "Baza 1"),
    ...processRawFlashcardsWithOptions(interna2, "Interna", "Baza 2"),
    ...processRawFlashcardsWithOptions(pediatria, "Pediatria", "Baza 1"),
    ...processRawFlashcardsWithOptions(pediatria2, "Pediatria", "Baza 2"),
    ...processRawFlashcardsWithOptions(chirurgia, "Chirurgia", "Baza 1"),
    ...processRawFlashcardsWithOptions(chirurgia2, "Chirurgia", "Baza 2"),
    ...processRawFlashcardsWithOptions(ginekologia, "Ginekologia i położnictwo", "Baza 1"),
    ...processRawFlashcardsWithOptions(ginekologia2, "Ginekologia i położnictwo", "Baza 2"),
    ...processRawFlashcardsWithOptions(medycynaRodzinna, "Medycyna rodzinna", "Baza 1"),
    ...processRawFlashcardsWithOptions(medycynaRodzinna2, "Medycyna rodzinna", "Baza 2"),
    ...processRawFlashcardsWithOptions(psychiatria, "Psychiatria", "Baza 1"),
    ...processRawFlashcardsWithOptions(psychiatria2, "Psychiatria", "Baza 2"),
    ...processRawFlashcardsWithOptions(medycynaRatunkowa, "Medycyna ratunkowa i intensywna terapia", "Baza 1"),
    ...processRawFlashcardsWithOptions(medycynaRatunkowa2, "Medycyna ratunkowa i intensywna terapia", "Baza 2"),
    ...processRawFlashcardsWithOptions(bioetyka, "Bioetyka i prawo medyczne", "Baza 1"),
    ...processRawFlashcardsWithOptions(bioetyka2, "Bioetyka i prawo medyczne", "Baza 2"),
    ...processRawFlashcardsWithOptions(zdrowiePubliczne, "Zdrowie publiczne", "Baza 1"),
    ...processRawFlashcardsWithOptions(zdrowiePubliczne2, "Zdrowie publiczne", "Baza 2"),
];

// Generate the final flashcards list with unique IDs and a creation timestamp.
// This processing happens only once when a user's localStorage is populated for the first time.
export const INITIAL_FLASHCARDS: Flashcard[] = allRawFlashcards.map(flashcard => ({
  ...flashcard,
  id: uuidv4(),
  createdAt: Date.now(),
}));