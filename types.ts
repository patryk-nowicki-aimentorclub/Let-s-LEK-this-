export interface Subscription {
  type: SubscriptionType;
  startDate: number; // timestamp
  endDate: number; // timestamp
}

export const SubscriptionTypes = {
    'dzienny': { durationDays: 1, name: 'Dzienny' },
    'tygodniowy': { durationDays: 7, name: 'Tygodniowy' },
    'miesięczny': { durationDays: 30, name: 'Miesięczny' },
    'roczny': { durationDays: 365, name: 'Roczny' },
    'premium': { durationDays: null, name: 'Premium (∞)' },
};
export type SubscriptionType = keyof typeof SubscriptionTypes;


export interface Flashcard {
  id: string;
  question: string;
  answer: string;
  category: string;
  base: string; // Changed from subcategory
  createdAt: number;
  subCategory?: string;
}

export interface User {
    id: string;
    name: string;
    login: string;
    // NOTE: This field stores the SHA-256 hash of the password.
    password_hash: string;
    isActive: boolean;
    subscription: Subscription | null;
}

export interface FlashcardsContextType {
  flashcards: Flashcard[];
  addFlashcard: (flashcard: Omit<Flashcard, 'id' | 'createdAt'>) => void;
  updateFlashcard: (id: string, updatedFlashcard: Partial<Omit<Flashcard, 'id' | 'createdAt'>>) => void;
  deleteFlashcard: (id: string) => void;
  loadFlashcardsFromJson: (jsonData: string, overrides?: { category: string; base: string }) => void;
  getFlashcardsByCategory: (categories: string[]) => Flashcard[];
  
  users: User[];
  addUser: (userData: Omit<User, 'id' | 'password_hash' | 'isActive' | 'subscription'> & { password_plaintext: string }) => Promise<void>;
  updateUser: (id: string, updatedData: Partial<User>) => Promise<void>;
  deleteUser: (id: string) => Promise<void>;
  login: (login: string, password_plaintext: string) => Promise<User | null>;
  registerUser: (userData: Omit<User, 'id' | 'password_hash' | 'isActive' | 'subscription'> & { password_plaintext: string }) => Promise<{success: boolean; message: string;}>;


  categories: string[];
  addCategory: (name: string) => void;
  updateCategory: (oldName: string, newName: string) => void;
  deleteCategory: (name: string) => void;
  deleteBase: (category: string, base: string) => void;
}


export enum StudyMode {
  AllFromSelected = 'Wszystkie z wybranego',
  RandomFromSelected = 'Wylosuj z wybranych',
  RandomFromAll = 'Losuj ze wszystkich działów'
}