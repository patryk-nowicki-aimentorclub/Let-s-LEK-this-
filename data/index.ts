import { Flashcard } from '../types';
import { v4 as uuidv4 } from 'uuid';
import { orzecznictwo } from './orzecznictwo';
import { orzecznictwoBaza2 } from './orzecznictwo-baza2';
import { bioetyka } from './bioetyka';
import { bioetykaBaza2 } from './bioetyka-baza2';
import { zdrowiePubliczne } from './zdrowie-publiczne';
import { zdrowiePubliczneBaza2 } from './zdrowie-publiczne-baza2';
import { medycynaRatunkowa } from './medycyna-ratunkowa';
import { medycynaRatunkowaBaza2 } from './medycyna-ratunkowa-baza2';
import { psychiatria } from './psychiatria';
import { psychiatriaBaza2 } from './psychiatria-baza2';
import { medycynaRodzinna } from './medycyna-rodzinna';
import { medycynaRodzinnaBaza2 } from './medycyna-rodzinna-baza2';
import { ginekologia } from './ginekologia';
import { ginekologiaBaza2 } from './ginekologia2';
import { chorobyWewnetrzne } from './choroby-wewnetrzne';
import { chorobyWewnetrzneBaza2 } from './choroby-wewnetrzne2';
import { pediatria } from './pediatria';
import { pediatriaBaza2 } from './pediatria2';
import { chirurgia } from './chirurgia';
import { chirurgia2 } from './chirurgia2';

/**
 * This file serves as the central point for aggregating all hardcoded flashcard databases.
 * When a new database file (e.g., `internalMedicine.ts`) is created in this directory,
 * it should be imported and spread into the `allRawFlashcards` array.
 */

// This type represents a flashcard before a unique ID and creation date are added.
type RawFlashcard = Omit<Flashcard, 'id' | 'createdAt'>;

// The main array to hold all flashcards from different database files.
// As new data files are added, they should be imported and included here.
// For example:
// import { internalMedicine } from './internalMedicine';
// const allRawFlashcards: RawFlashcard[] = [...internalMedicine];
const allRawFlashcards: RawFlashcard[] = [
    ...orzecznictwo,
    ...orzecznictwoBaza2,
    ...bioetyka,
    ...bioetykaBaza2,
    ...zdrowiePubliczne,
    ...zdrowiePubliczneBaza2,
    ...medycynaRatunkowa,
    ...medycynaRatunkowaBaza2,
    ...psychiatria,
    ...psychiatriaBaza2,
    ...medycynaRodzinna,
    ...medycynaRodzinnaBaza2,
    ...chorobyWewnetrzne,
    ...chorobyWewnetrzneBaza2,
    ...pediatria,
    ...pediatriaBaza2,
    ...chirurgia,
    ...chirurgia2,
    ...ginekologia,
    ...ginekologiaBaza2,
];

// Generate the final flashcards list with unique IDs and a creation timestamp.
// This processing happens only once when a user's localStorage is populated for the first time.
export const INITIAL_FLASHCARDS: Flashcard[] = allRawFlashcards.map(flashcard => ({
  ...flashcard,
  id: uuidv4(),
  createdAt: Date.now(),
}));