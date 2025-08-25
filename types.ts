export interface Flashcard {
  id: string;
  question: string;
  answer: string;
  category: string;
  base: string; // Changed from subcategory
  createdAt: number;
}

export interface User {
    id: string;
    name: string;
    login: string;
    // NOTE: This field stores the SHA-256 hash of the password.
    password_hash: string;
}

export interface FlashcardsContextType {
  flashcards: Flashcard[];
  addFlashcard: (flashcard: Omit<Flashcard, 'id' | 'createdAt'>) => void;
  updateFlashcard: (id: string, updatedFlashcard: Partial<Omit<Flashcard, 'id' | 'createdAt'>>) => void;
  deleteFlashcard: (id: string) => void;
  loadFlashcardsFromJson: (jsonData: string, overrides?: { category: string; base: string }) => void;
  getFlashcardsByCategory: (categories: string[]) => Flashcard[];
  
  users: User[];
  addUser: (userData: Omit<User, 'id' | 'password_hash'> & { password_plaintext: string }) => Promise<void>;
  deleteUser: (id: string) => Promise<void>;
  login: (login: string, password_plaintext: string) => Promise<boolean>;

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