
import React, { useState, ChangeEvent, useRef, FormEvent, useMemo } from 'react';
import { useFlashcards } from '../hooks/useFlashcards';
import { Flashcard, User, Subscription, SubscriptionTypes, SubscriptionType } from '../types';

interface AdminPanelProps {
  onLoginSuccess?: (user: User) => void;
  onLogout?: () => void;
  isAdmin?: boolean;
}

type AdminTab = 'flashcards' | 'users' | 'content';

// --- Style Constants ---
const inputClasses = "w-full p-2 rounded bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-white border border-slate-300 dark:border-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500";
const btnPrimary = "bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed";
const btnSecondary = "bg-slate-200 hover:bg-slate-300 dark:bg-slate-600 dark:hover:bg-slate-700 text-slate-800 dark:text-white font-bold py-2 px-4 rounded";
const textDanger = "font-medium text-red-600 dark:text-red-500 hover:underline";
const textWarning = "font-medium text-amber-600 dark:text-amber-500 hover:underline";

// --- Tab Components ---

const FlashcardsTab: React.FC<{ onImportClick: () => void }> = ({ onImportClick }) => {
    const { flashcards, categories, addFlashcard, updateFlashcard, deleteFlashcard, loadFlashcardsFromJson } = useFlashcards();
    const [editingCard, setEditingCard] = useState<Flashcard | null>(null);
    const [isCreating, setIsCreating] = useState(false);
    const [showPasteForm, setShowPasteForm] = useState(false);
    const [jsonInput, setJsonInput] = useState('');
    const [importCategory, setImportCategory] = useState('');
    const [importBase, setImportBase] = useState('');

    const handleSave = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const data = Object.fromEntries(formData.entries()) as Omit<Flashcard, 'id' | 'createdAt'>;

        if (!data.category) {
            alert("Proszę wybrać kategorię.");
            return;
        }

        if (editingCard) {
            updateFlashcard(editingCard.id, data);
        } else {
            addFlashcard(data);
        }
        setEditingCard(null);
        setIsCreating(false);
    };
    
    const handlePasteImport = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!jsonInput.trim()) {
            alert("Proszę wkleić zawartość JSON.");
            return;
        }
        if (!importCategory) {
            alert("Proszę wybrać kategorię.");
            return;
        }
        if (!importBase.trim()) {
            alert("Proszę podać nazwę bazy.");
            return;
        }
        
        loadFlashcardsFromJson(jsonInput, { category: importCategory, base: importBase });

        setShowPasteForm(false);
        setJsonInput('');
        setImportCategory('');
        setImportBase('');
    };

    return (
        <div>
            {(editingCard || isCreating) ? (
                <form onSubmit={handleSave} className="bg-white dark:bg-slate-800 p-6 rounded-lg mb-6">
                    <h2 className="text-xl font-bold mb-4">{editingCard ? 'Edytuj' : 'Dodaj'} Fiszke</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <input required name="question" defaultValue={editingCard?.question || ''} placeholder="Pytanie" className={inputClasses} />
                        <input required name="answer" defaultValue={editingCard?.answer || ''} placeholder="Odpowiedź" className={inputClasses} />
                        <select required name="category" defaultValue={editingCard?.category || ''} className={inputClasses}>
                           <option value="">-- Wybierz kategorię --</option>
                           {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                        </select>
                        <input required name="base" defaultValue={editingCard?.base || ''} placeholder="Baza (np. Baza 2023)" className={inputClasses} />
                    </div>
                    <div className="mt-4 flex gap-4">
                        <button type="submit" className={btnPrimary}>Zapisz</button>
                        <button type="button" onClick={() => { setEditingCard(null); setIsCreating(false); }} className={btnSecondary}>Anuluj</button>
                    </div>
                </form>
            ) : (
                <>
                    <div className="flex flex-wrap gap-4 mb-6">
                       <button onClick={() => setIsCreating(true)} className={btnPrimary}>Dodaj nową fiszkę</button>
                       <button onClick={onImportClick} className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg">Importuj z pliku JSON</button>
                       <button onClick={() => setShowPasteForm(s => !s)} className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded-lg">
                           {showPasteForm ? 'Ukryj import z tekstu' : 'Wklej z tekstu JSON'}
                       </button>
                    </div>
                    
                    {showPasteForm && (
                        <form onSubmit={handlePasteImport} className="bg-slate-100 dark:bg-slate-900/50 p-6 rounded-lg mb-6 border border-slate-200 dark:border-slate-700">
                             <h3 className="text-lg font-bold mb-4">Importuj Fiszki z Tekstu</h3>
                             <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
                                Wklej poniżej tablicę obiektów JSON. Każdy obiekt musi zawierać klucze "pytanie" i "odpowiedz". Wybrana kategoria i baza zostaną przypisane do wszystkich importowanych fiszek.
                             </p>
                             <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                <select required value={importCategory} onChange={e => setImportCategory(e.target.value)} className={inputClasses}>
                                   <option value="">-- Wybierz kategorię docelową --</option>
                                   {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                                </select>
                                <input required value={importBase} onChange={e => setImportBase(e.target.value)} placeholder="Nazwa bazy docelowej (np. Baza 2024)" className={inputClasses} />
                            </div>
                             <textarea 
                                value={jsonInput}
                                onChange={(e) => setJsonInput(e.target.value)}
                                placeholder='[{"pytanie": "Jakie jest pytanie?", "odpowiedz": "Jaka jest odpowiedź?"}]' 
                                className={`${inputClasses} h-40 min-h-[10rem] font-mono text-sm`}
                                required
                             />
                             <div className="mt-4 flex gap-4">
                                <button type="submit" className={btnPrimary}>Importuj</button>
                                <button type="button" onClick={() => setShowPasteForm(false)} className={btnSecondary}>Anuluj</button>
                             </div>
                        </form>
                    )}
                </>
            )}
            <div className="overflow-x-auto bg-white dark:bg-slate-800 rounded-lg">
                <table className="w-full text-sm text-left text-slate-600 dark:text-slate-300">
                    <thead className="text-xs text-blue-800 dark:text-blue-300 uppercase bg-slate-100 dark:bg-slate-700">
                        <tr>
                            <th scope="col" className="px-6 py-3">Pytanie</th>
                            <th scope="col" className="px-6 py-3">Kategoria</th>
                             <th scope="col" className="px-6 py-3">Baza</th>
                            <th scope="col" className="px-6 py-3">Akcje</th>
                        </tr>
                    </thead>
                    <tbody>
                        {flashcards.map(card => (
                            <tr key={card.id} className="border-b border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/50">
                                <td className="px-6 py-4 font-medium text-slate-900 dark:text-white">{card.question}</td>
                                <td className="px-6 py-4">{card.category}</td>
                                <td className="px-6 py-4">{card.base}</td>
                                <td className="px-6 py-4 flex gap-2">
                                    <button onClick={() => setEditingCard(card)} className={textWarning}>Edytuj</button>
                                    <button onClick={() => window.confirm('Czy na pewno chcesz usunąć tę fiszkę?') && deleteFlashcard(card.id)} className={textDanger}>Usuń</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

const UsersTab: React.FC = () => {
    const { users, addUser, deleteUser, updateUser } = useFlashcards();
    const [newUser, setNewUser] = useState({ name: '', login: '', password: ''});
    
    // State for the new subscription modal
    const [isSubModalOpen, setIsSubModalOpen] = useState(false);
    const [subModalData, setSubModalData] = useState<{ user: User, type: SubscriptionType } | null>(null);
    const [newSubscriptionStartDate, setNewSubscriptionStartDate] = useState('');

    const toISOStringLocal = (date: Date) => {
        const offset = date.getTimezoneOffset();
        const dateWithOffset = new Date(date.getTime() - (offset*60*1000));
        return dateWithOffset.toISOString().slice(0,16);
    };

    const handleAddUser = async (e: FormEvent) => {
        e.preventDefault();
        if(newUser.name.trim() && newUser.login.trim() && newUser.password.trim()) {
            await addUser({
                name: newUser.name,
                login: newUser.login,
                password_plaintext: newUser.password
            });
            setNewUser({ name: '', login: '', password: ''});
        }
    };
    
    const isSystemUser = (user: User) => user.login === 'admin' || user.login === 'ula';
    
    const handleStatusChange = async (user: User, newStatus: boolean) => {
        if (isSystemUser(user)) return;
        await updateUser(user.id, { isActive: newStatus });
    };

    const handleSubscriptionSelect = (user: User, selection: SubscriptionType | 'none') => {
        if (user.subscription?.type === selection) return;

        if (selection === 'none') {
            if (window.confirm(`Czy na pewno chcesz usunąć subskrypcję użytkownika "${user.name}"?`)) {
                updateUser(user.id, { subscription: null });
            }
        } else if (selection === 'premium') {
             if (window.confirm(`Czy na pewno chcesz przypisać subskrypcję Premium (bezterminową) użytkownikowi "${user.name}"?`)) {
                const newSubscription: Subscription = {
                    type: 'premium',
                    startDate: Date.now(),
                    endDate: Number.MAX_SAFE_INTEGER
                };
                updateUser(user.id, { subscription: newSubscription });
            }
        } else {
            setSubModalData({ user, type: selection });
            setNewSubscriptionStartDate(toISOStringLocal(new Date()));
            setIsSubModalOpen(true);
        }
    };

    const handleSaveNewSubscription = async () => {
        if (!subModalData || !newSubscriptionStartDate) return;

        const startDate = new Date(newSubscriptionStartDate).getTime();
        const durationDays = SubscriptionTypes[subModalData.type].durationDays;
        const endDate = startDate + (durationDays || 0) * 24 * 60 * 60 * 1000;

        const newSubscription: Subscription = { type: subModalData.type, startDate, endDate };
        await updateUser(subModalData.user.id, { subscription: newSubscription });
        
        setIsSubModalOpen(false);
        setSubModalData(null);
    };


    return (
        <div className="bg-white dark:bg-slate-800 p-6 rounded-lg">
            <p className="text-sm text-slate-500 dark:text-slate-400 bg-slate-100/50 dark:bg-slate-900/50 p-3 rounded-md mb-6 border border-slate-200 dark:border-slate-700">
                <b>Uwaga:</b> Dane użytkowników są przechowywane w sposób zaszyfrowany w pamięci przeglądarki. Hasła są hashowane przed zaszyfrowaniem.
            </p>
            <form onSubmit={handleAddUser} className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 items-end mb-6">
                <input required value={newUser.name} onChange={e => setNewUser(u => ({...u, name: e.target.value}))} placeholder="Imię" className={inputClasses} />
                <input required value={newUser.login} onChange={e => setNewUser(u => ({...u, login: e.target.value}))} placeholder="Login" className={inputClasses} />
                <input required type="password" value={newUser.password} onChange={e => setNewUser(u => ({...u, password: e.target.value}))} placeholder="Hasło" className={inputClasses} />
                <button type="submit" className={btnPrimary}>Dodaj użytkownika</button>
            </form>
            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left text-slate-600 dark:text-slate-300">
                     <thead className="text-xs text-blue-800 dark:text-blue-300 uppercase bg-slate-100 dark:bg-slate-700">
                        <tr>
                            <th className="px-4 py-3">Nazwa</th>
                            <th className="px-4 py-3">Login</th>
                            <th className="px-4 py-3">Status</th>
                            <th className="px-4 py-3">Subskrypcja</th>
                            <th className="px-4 py-3">Wygasa</th>
                            <th className="px-4 py-3">Akcje</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map(user => (
                            <tr key={user.id} className="border-b border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/50">
                                <td className="px-4 py-3 font-medium text-slate-900 dark:text-white min-w-[120px]">{user.name}</td>
                                <td className="px-4 py-3">{user.login}</td>
                                <td className="px-4 py-3 min-w-[120px]">
                                     <select
                                        value={user.isActive ? 'active' : 'inactive'}
                                        onChange={(e) => handleStatusChange(user, e.target.value === 'active')}
                                        disabled={isSystemUser(user)}
                                        className={`${inputClasses} text-xs py-1 px-2 w-full ${user.isActive ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 border-green-300' : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200 border-red-300'}`}
                                    >
                                        <option value="active">Aktywny</option>
                                        <option value="inactive">Nieaktywny</option>
                                    </select>
                                </td>
                                <td className="px-4 py-3 min-w-[140px]">
                                     <select
                                        value={user.subscription?.type || 'none'}
                                        onChange={(e) => handleSubscriptionSelect(user, e.target.value as SubscriptionType | 'none')}
                                        disabled={isSystemUser(user)}
                                        className={`${inputClasses} text-xs py-1 px-2 w-full`}
                                    >
                                        <option value="none">Brak</option>
                                        {Object.entries(SubscriptionTypes).map(([key, { name }]) => (
                                            <option key={key} value={key}>{name}</option>
                                        ))}
                                    </select>
                                </td>
                                <td className="px-4 py-3 text-xs text-slate-500 dark:text-slate-400 min-w-[150px]">
                                    {user.subscription ? (
                                        user.subscription.type === 'premium' ? (
                                            <span className="font-semibold">Nieograniczona (∞)</span>
                                        ) : (
                                            new Date(user.subscription.endDate).toLocaleString('pl-PL', { dateStyle: 'short', timeStyle: 'short' })
                                        )
                                    ) : '-'}
                                </td>
                                <td className="px-4 py-3">
                                    {!isSystemUser(user) && <button onClick={() => window.confirm(`Czy na pewno chcesz usunąć użytkownika "${user.name}"?`) && deleteUser(user.id)} className={textDanger}>Usuń</button>}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {isSubModalOpen && subModalData && (
                 <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={() => setIsSubModalOpen(false)}>
                    <div className="bg-white dark:bg-slate-800 rounded-lg shadow-xl p-6 w-full max-w-sm" onClick={e => e.stopPropagation()}>
                        <h2 className="text-xl font-bold mb-4">Ustaw subskrypcję dla: {subModalData.user.name}</h2>
                        <p className="mb-4 text-slate-600 dark:text-slate-300">Typ subskrypcji: <strong>{SubscriptionTypes[subModalData.type].name}</strong></p>
                        <div>
                            <label htmlFor="sub-start-new" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Data rozpoczęcia</label>
                            <input 
                                id="sub-start-new" 
                                type="datetime-local" 
                                value={newSubscriptionStartDate} 
                                onChange={e => setNewSubscriptionStartDate(e.target.value)} 
                                className={inputClasses} 
                            />
                        </div>
                        <div className="mt-6 flex justify-end gap-4">
                            <button onClick={handleSaveNewSubscription} className={btnPrimary}>Zapisz i aktywuj</button>
                            <button onClick={() => setIsSubModalOpen(false)} className={btnSecondary}>Anuluj</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

const ContentManagementTab: React.FC = () => {
    const { flashcards, categories, addCategory, updateCategory, deleteCategory, deleteBase } = useFlashcards();
    const [newCategoryName, setNewCategoryName] = useState('');

    const handleAddCategory = (e: FormEvent) => {
        e.preventDefault();
        if (newCategoryName.trim()) {
            addCategory(newCategoryName.trim());
            setNewCategoryName('');
        }
    };

    const handleEditCategory = (oldName: string) => {
        const newName = prompt(`Edytuj nazwę kategorii "${oldName}":`, oldName);
        if (newName && newName.trim() && newName.trim() !== oldName) {
            updateCategory(oldName, newName.trim());
        }
    };
    
    const handleDeleteCategory = (name: string) => {
        if (window.confirm(`Czy na pewno chcesz usunąć kategorię "${name}"? Spowoduje to USUNIĘCIE WSZYSTKICH fiszek w tej kategorii.`)) {
            deleteCategory(name);
        }
    };

    const handleDeleteBase = (category: string, base: string) => {
        if (window.confirm(`Czy na pewno chcesz usunąć bazę "${base}" z kategorii "${category}"? Spowoduje to USUNIĘCIE WSZYSTKICH fiszek w tej bazie.`)) {
            deleteBase(category, base);
        }
    };
    
    const basesByCategory = useMemo(() => {
        const grouped: { [category: string]: string[] } = {};
        flashcards.forEach(fc => {
            if (!grouped[fc.category]) {
                grouped[fc.category] = [];
            }
            if (!grouped[fc.category].includes(fc.base)) {
                grouped[fc.category].push(fc.base);
            }
        });
        // Sort bases within each category
        for (const category in grouped) {
            grouped[category].sort();
        }
        return grouped;
    }, [flashcards]);

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Category Management */}
            <div className="bg-white dark:bg-slate-800 p-6 rounded-lg">
                <h3 className="text-xl font-bold mb-4">Zarządzaj Kategoriami</h3>
                <form onSubmit={handleAddCategory} className="flex gap-2 mb-4">
                    <input value={newCategoryName} onChange={e => setNewCategoryName(e.target.value)} placeholder="Nowa nazwa kategorii" className={`${inputClasses} flex-grow`} />
                    <button type="submit" className={btnPrimary}>Dodaj</button>
                </form>
                <ul className="space-y-2">
                    {categories.map(cat => (
                        <li key={cat} className="flex justify-between items-center p-3 bg-slate-100 dark:bg-slate-700 rounded-lg">
                            <span className="font-medium text-slate-900 dark:text-white">{cat}</span>
                            <div className="flex gap-2">
                                <button onClick={() => handleEditCategory(cat)} className={textWarning}>Edytuj</button>
                                <button onClick={() => handleDeleteCategory(cat)} className={textDanger}>Usuń</button>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>

            {/* Base Management */}
            <div className="bg-white dark:bg-slate-800 p-6 rounded-lg">
                <h3 className="text-xl font-bold mb-4">Zarządzaj Bazami Pytań</h3>
                <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
                    {Object.entries(basesByCategory).sort(([catA], [catB]) => catA.localeCompare(catB)).map(([category, bases]) => (
                        <div key={category}>
                            <h4 className="font-bold text-blue-700 dark:text-blue-400 border-b border-slate-200 dark:border-slate-700 pb-1 mb-2">{category}</h4>
                            <ul className="space-y-2">
                                {bases.map(base => (
                                    <li key={`${category}-${base}`} className="flex justify-between items-center p-2 bg-slate-100 dark:bg-slate-700 rounded-lg">
                                        <span className="text-sm text-slate-800 dark:text-slate-200">{base}</span>
                                        <button onClick={() => handleDeleteBase(category, base)} className={`${textDanger} text-xs`}>Usuń całą bazę</button>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};


const AdminPanel: React.FC<AdminPanelProps> = ({ onLoginSuccess, onLogout, isAdmin = false }) => {
  const { loadFlashcardsFromJson, flashcards, users, login } = useFlashcards();
  
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState<AdminTab>('users');

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const user = await login(username, password);
    if (user && user.login === 'admin') {
      setError('');
      if (onLoginSuccess) onLoginSuccess(user);
    } else {
      setError('Nieprawidłowy login lub hasło administratora.');
    }
  };
  
  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target?.result as string;
        loadFlashcardsFromJson(text);
      };
      reader.readAsText(file);
      if(event.target) event.target.value = '';
    }
  };
  
  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <form onSubmit={handleLogin} className="bg-white dark:bg-slate-800 p-8 rounded-lg shadow-lg w-full max-w-sm">
          <h2 className="text-2xl font-bold mb-6 text-center">Logowanie Administratora</h2>
          {error && <p className="bg-red-100 text-red-700 p-3 rounded mb-4 text-sm border border-red-200">{error}</p>}
          <div className="mb-4">
            <label className="block text-slate-600 dark:text-slate-400 mb-2" htmlFor="username">Login</label>
            <input type="text" id="username" value={username} onChange={e => setUsername(e.target.value)} className={inputClasses} required />
          </div>
          <div className="mb-6">
            <label className="block text-slate-600 dark:text-slate-400 mb-2" htmlFor="password">Hasło</label>
            <input type="password" id="password" value={password} onChange={e => setPassword(e.target.value)} className={inputClasses} required />
          </div>
          <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition-colors">Zaloguj</button>
        </form>
      </div>
    );
  }
  
  const getTabClass = (tabName: AdminTab) => 
    `py-2 px-4 font-semibold rounded-t-lg transition-colors ${activeTab === tabName ? 'bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400' : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600'}`;

  const handleImportClick = () => fileInputRef.current?.click();

  return (
    <div className="p-4 sm:p-8">
      <header className="flex flex-wrap justify-between items-center mb-6 gap-4">
        <h1 className="text-3xl font-bold text-blue-800 dark:text-blue-300">Panel Administratora</h1>
        <button onClick={onLogout} className="bg-slate-200 hover:bg-slate-300 dark:bg-slate-600 dark:hover:bg-slate-700 text-slate-800 dark:text-white font-bold py-2 px-4 rounded-lg">Wyloguj</button>
      </header>
      
       <input type="file" accept=".json" ref={fileInputRef} onChange={handleFileChange} className="hidden" />

      <nav className="flex flex-wrap border-b border-slate-200 dark:border-slate-700">
        <button onClick={() => setActiveTab('users')} className={getTabClass('users')}>Użytkownicy ({users.length})</button>
        <button onClick={() => setActiveTab('flashcards')} className={getTabClass('flashcards')}>Fiszki ({flashcards.length})</button>
        <button onClick={() => setActiveTab('content')} className={getTabClass('content')}>Zarządzanie Treścią</button>
      </nav>
      
      <main className="mt-6">
        {activeTab === 'flashcards' && <FlashcardsTab onImportClick={handleImportClick} />}
        {activeTab === 'users' && <UsersTab />}
        {activeTab === 'content' && <ContentManagementTab />}
      </main>
    </div>
  );
};

export default AdminPanel;