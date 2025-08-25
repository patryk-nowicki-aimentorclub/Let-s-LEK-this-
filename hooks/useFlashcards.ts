import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Flashcard, User, FlashcardsContextType } from '../types';
import { INITIAL_FLASHCARDS } from '../data';
import { INITIAL_CATEGORIES, INITIAL_USERS } from '../constants';
import { encrypt, decrypt, hashPassword } from '../services/geminiService';

// A robust, standard implementation of the useLocalStorage hook.
// This version wraps the state setter to ensure that localStorage is
// updated synchronously with the state change. It is also resilient to
// corrupted data (e.g., a 'null' string) that may have been stored by
// previous buggy versions of the hook.
function useLocalStorage<T>(key: string, initialValue: T): [T, (value: T | ((val: T) => T)) => void] {
  const [storedValue, setStoredValue] = useState<T>(() => {
    if (typeof window === 'undefined') {
      return initialValue;
    }
    try {
      const item = window.localStorage.getItem(key);
      if (item) {
        const parsed = JSON.parse(item);
        // Use nullish coalescing operator to fall back to initialValue if the stored item is `null`.
        // This prevents the app from crashing if it expects an array but gets null from localStorage.
        return parsed ?? initialValue; 
      }
      return initialValue;
    } catch (error) {
      console.error(`Error reading localStorage key “${key}”:`, error);
      // If parsing fails, fall back to the initial value.
      return initialValue;
    }
  });

  const setValue = (value: T | ((val: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      }
    } catch (error) {
      console.error(`Error setting localStorage key “${key}”:`, error);
    }
  };

  return [storedValue, setValue];
}


const FlashcardsContext = createContext<FlashcardsContextType | undefined>(undefined);

export const FlashcardProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [flashcards, setFlashcards] = useLocalStorage<Flashcard[]>('flashcards', INITIAL_FLASHCARDS);
  const [users, setUsers] = useState<User[]>([]);
  const [categories, setCategories] = useLocalStorage<string[]>('categories', INITIAL_CATEGORIES);


  // Initialize and load users from encrypted storage
  useEffect(() => {
    const initializeUsers = async () => {
      try {
        const encryptedUsers = window.localStorage.getItem('encrypted_users');
        if (encryptedUsers && encryptedUsers !== '') {
          const decryptedJson = await decrypt(encryptedUsers);
          setUsers(JSON.parse(decryptedJson));
        } else {
          // No users in storage, so create and store the initial admin user
          const initialUsersWithHashes: User[] = await Promise.all(
            INITIAL_USERS.map(async (user) => ({
              id: user.id,
              name: user.name,
              login: user.login,
              password_hash: await hashPassword(user.password_placeholder),
            }))
          );
          const jsonToEncrypt = JSON.stringify(initialUsersWithHashes);
          const encryptedData = await encrypt(jsonToEncrypt);
          window.localStorage.setItem('encrypted_users', encryptedData);
          setUsers(initialUsersWithHashes);
        }
      } catch (error) {
        console.error("Failed to initialize users:", error);
        window.localStorage.removeItem('encrypted_users');
        alert("Wystąpił błąd przy wczytywaniu danych użytkowników. Dane mogły zostać zresetowane.");
      }
    };

    initializeUsers();
  }, []);

  const persistUsers = useCallback(async (updatedUsers: User[]) => {
    try {
      const jsonToEncrypt = JSON.stringify(updatedUsers);
      const encryptedData = await encrypt(jsonToEncrypt);
      window.localStorage.setItem('encrypted_users', encryptedData);
      setUsers(updatedUsers);
    } catch (error) {
      console.error("Failed to save users:", error);
      alert("Nie udało się zapisać zmian w danych użytkowników.");
    }
  }, []);

  // Flashcard Management
  const addFlashcard = useCallback((flashcardData: Omit<Flashcard, 'id' | 'createdAt'>) => {
    const newFlashcard: Flashcard = { ...flashcardData, id: uuidv4(), createdAt: Date.now() };
    setFlashcards(prev => [...prev, newFlashcard]);
  }, [setFlashcards]);

  const updateFlashcard = useCallback((id: string, updatedData: Partial<Flashcard>) => {
    setFlashcards(prev =>
      prev.map(fc => (fc.id === id ? { ...fc, ...updatedData } : fc))
    );
  }, [setFlashcards]);

  const deleteFlashcard = useCallback((id: string) => {
    setFlashcards(prev => prev.filter(fc => fc.id !== id));
  }, [setFlashcards]);

  const loadFlashcardsFromJson = useCallback((jsonData: string, overrides?: { category: string; base: string }) => {
    try {
      const parsedData = JSON.parse(jsonData);
      // ... (rest of the function is unchanged)
       if (!Array.isArray(parsedData)) {
        throw new Error("Invalid JSON structure. The provided data is not an array.");
      }

      const validItems = parsedData.filter(item => 
        item && typeof item === 'object' && 'pytanie' in item && 'odpowiedz' in item
      );
      
      const skippedCount = parsedData.length - validItems.length;

      if (validItems.length === 0) {
        if (parsedData.length > 0) {
          alert(`Import nie powiódł się. Żaden z ${parsedData.length} wpisów nie zawierał wymaganych pól "pytanie" i "odpowiedz".`);
        } else {
          alert("Plik JSON jest pusty lub nie zawiera żadnych fiszek do zaimportowania.");
        }
        return;
      }

      if (skippedCount > 0) {
        alert(`Pominięto ${skippedCount} nieprawidłowych wpisów. Zostaną zaimportowane ${validItems.length} poprawne fiszki.`);
      }

      const newFlashcards: Flashcard[] = validItems.map(item => {
        const finalCategory = overrides?.category || item.category;
        const finalBase = overrides?.base || item.base;

        if (!finalCategory || !finalBase) {
          throw new Error(`Flashcard with question "${String(item.pytanie).substring(0, 20)}..." is missing category or base information, and no override was provided.`);
        }

        return {
          id: item.id || uuidv4(),
          question: item.pytanie,
          answer: item.odpowiedz,
          category: finalCategory,
          base: finalBase,
          createdAt: Date.now()
        };
      });

      setFlashcards(prev => [...prev, ...newFlashcards]);
      alert(`${newFlashcards.length} fiszek zostało pomyślnie zaimportowanych!`);
    } catch (error) {
      console.error("Error parsing JSON file:", error);
      alert(`Błąd podczas importowania pliku JSON. Sprawdź format i spróbuj ponownie. Błąd: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }, [setFlashcards]);
    
  // User Management
  const addUser = useCallback(async (userData: Omit<User, 'id' | 'password_hash'> & { password_plaintext: string }) => {
    const password_hash = await hashPassword(userData.password_plaintext);
    const newUser: User = { 
      id: uuidv4(), 
      name: userData.name,
      login: userData.login,
      password_hash
    };
    const updatedUsers = [...users, newUser];
    await persistUsers(updatedUsers);
  }, [users, persistUsers]);

  const deleteUser = useCallback(async (id: string) => {
    const userToDelete = users.find(user => user.id === id);
    if (userToDelete && (userToDelete.login === 'admin' || userToDelete.login === 'ula')) {
      alert('Nie można usunąć wbudowanych kont systemowych.');
      return;
    }

     // Prevent deleting the last user
    if (users.length <= 1) {
        alert("Nie można usunąć ostatniego administratora.");
        return;
    }
    const updatedUsers = users.filter(user => user.id !== id);
    await persistUsers(updatedUsers);
  }, [users, persistUsers]);

  const login = useCallback(async (login: string, password_plaintext: string): Promise<boolean> => {
      const user = users.find(u => u.login === login);
      if (!user) return false;

      const inputHash = await hashPassword(password_plaintext);
      return inputHash === user.password_hash;
  }, [users]);
  
  // Category and Base Management
  const addCategory = useCallback((name: string) => {
    if (name && !categories.includes(name)) {
      setCategories(prev => [...prev, name].sort());
    } else {
      alert("Kategoria o tej nazwie już istnieje lub nazwa jest nieprawidłowa.");
    }
  }, [categories, setCategories]);

  const updateCategory = useCallback((oldName: string, newName: string) => {
    if (newName && !categories.includes(newName)) {
      setCategories(prev => prev.map(c => (c === oldName ? newName : c)).sort());
      setFlashcards(prev => prev.map(fc => (fc.category === oldName ? { ...fc, category: newName } : fc)));
    } else {
      alert("Nowa nazwa kategorii jest już w użyciu lub jest nieprawidłowa.");
    }
  }, [categories, setCategories, setFlashcards]);

  const deleteCategory = useCallback((name: string) => {
    setCategories(prev => prev.filter(c => c !== name));
    setFlashcards(prev => prev.filter(fc => fc.category !== name));
  }, [setCategories, setFlashcards]);

  const deleteBase = useCallback((category: string, base: string) => {
    setFlashcards(prev => prev.filter(fc => !(fc.category === category && fc.base === base)));
  }, [setFlashcards]);

  const getFlashcardsByCategory = useCallback((cats: string[]) => {
      return flashcards.filter(fc => cats.includes(fc.category));
  }, [flashcards]);

  const providerValue: FlashcardsContextType = {
    flashcards,
    addFlashcard,
    updateFlashcard,
    deleteFlashcard,
    loadFlashcardsFromJson,
    getFlashcardsByCategory,
    users,
    addUser,
    deleteUser,
    login,
    categories,
    addCategory,
    updateCategory,
    deleteCategory,
    deleteBase
  };

  return React.createElement(FlashcardsContext.Provider, { value: providerValue }, children);
};

export const useFlashcards = (): FlashcardsContextType => {
  const context = useContext(FlashcardsContext);
  if (context === undefined) {
    throw new Error('useFlashcards must be used within a FlashcardProvider');
  }
  return context;
};
