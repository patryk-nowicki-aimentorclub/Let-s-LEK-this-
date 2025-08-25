import React, { useState } from 'react';
import { useFlashcards } from '../hooks/useFlashcards';

interface WelcomeScreenProps {
  onLoginSuccess: (login: string) => void;
}

const inputClasses = "w-full p-3 rounded bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-white border border-slate-300 dark:border-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors";
const btnPrimary = "w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg transition-colors";

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onLoginSuccess }) => {
    const { login: performLogin } = useFlashcards();
    const [login, setLogin] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        const success = await performLogin(login, password);
        if (success) {
            onLoginSuccess(login);
        } else {
            setError('Nieprawidłowy login lub hasło.');
        }
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-slate-50 dark:bg-slate-900">
            <header className="text-center mb-8">
                <h1 className="text-5xl sm:text-6xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                    Witaj w <span className="text-blue-600 dark:text-blue-500">Let's LEK this!</span>
                </h1>
                <p className="mt-2 text-lg text-slate-600 dark:text-slate-400">Zaloguj się, aby rozpocząć naukę.</p>
            </header>
            <main>
                <form onSubmit={handleLogin} className="bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-2xl w-full max-w-sm">
                    <h2 className="text-2xl font-bold mb-6 text-center text-slate-800 dark:text-slate-200">Logowanie</h2>
                    {error && <p className="bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 p-3 rounded-md mb-4 text-sm border border-red-200 dark:border-red-800/50">{error}</p>}
                    <div className="mb-4">
                        <label className="block text-slate-600 dark:text-slate-400 mb-2 font-semibold" htmlFor="login">Login</label>
                        <input type="text" id="login" value={login} onChange={e => setLogin(e.target.value)} className={inputClasses} required autoFocus />
                    </div>
                    <div className="mb-6">
                        <label className="block text-slate-600 dark:text-slate-400 mb-2 font-semibold" htmlFor="password">Hasło</label>
                        <input type="password" id="password" value={password} onChange={e => setPassword(e.target.value)} className={inputClasses} required />
                    </div>
                    <button type="submit" className={btnPrimary}>Zaloguj</button>
                </form>
            </main>
        </div>
    );
};

export default WelcomeScreen;