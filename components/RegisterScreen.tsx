
import React, { useState, FormEvent } from 'react';
import { useFlashcards } from '../hooks/useFlashcards';

interface RegisterScreenProps {
  onBack: () => void;
}

const inputClasses = "w-full p-3 rounded bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-white border border-slate-300 dark:border-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500";
const btnPrimary = "w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg transition-colors";

const RegisterScreen: React.FC<RegisterScreenProps> = ({ onBack }) => {
  const { registerUser } = useFlashcards();
  const [name, setName] = useState('');
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setMessage('');
    setIsSuccess(false);

    if (password !== confirmPassword) {
      setMessage('Hasła nie są zgodne.');
      return;
    }

    if (password.length < 6) {
        setMessage('Hasło musi mieć co najmniej 6 znaków.');
        return;
    }

    const result = await registerUser({ name, login, password_plaintext: password });
    setMessage(result.message);
    if (result.success) {
      setIsSuccess(true);
      setName('');
      setLogin('');
      setPassword('');
      setConfirmPassword('');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900">
      <div className="w-full max-w-md relative">
        <button onClick={onBack} className="absolute top-4 left-4 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-600 font-semibold transition-colors duration-200 text-sm mb-4 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-offset-slate-800">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Wróć
        </button>
        <form onSubmit={handleSubmit} className="bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-2xl space-y-6">
          <h2 className="text-3xl font-bold text-center text-slate-900 dark:text-white">Rejestracja</h2>
          
          {message && (
            <p className={`p-3 rounded text-sm text-center ${isSuccess ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-200'}`} role="alert">
              {message}
            </p>
          )}

          {isSuccess ? (
             <button type="button" onClick={onBack} className={btnPrimary}>
                Przejdź do logowania
              </button>
          ) : (
            <>
              <div>
                <label className="block text-slate-600 dark:text-slate-400 mb-2" htmlFor="name">Imię</label>
                <input type="text" id="name" value={name} onChange={e => setName(e.target.value)} className={inputClasses} required />
              </div>
              <div>
                <label className="block text-slate-600 dark:text-slate-400 mb-2" htmlFor="login">Login</label>
                <input type="text" id="login" value={login} onChange={e => setLogin(e.target.value)} className={inputClasses} required />
              </div>
              <div>
                <label className="block text-slate-600 dark:text-slate-400 mb-2" htmlFor="password">Hasło</label>
                <input type="password" id="password" value={password} onChange={e => setPassword(e.target.value)} className={inputClasses} required />
              </div>
               <div>
                <label className="block text-slate-600 dark:text-slate-400 mb-2" htmlFor="confirm-password">Potwierdź hasło</label>
                <input type="password" id="confirm-password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} className={inputClasses} required />
              </div>
              <button type="submit" className={btnPrimary}>Zarejestruj się</button>
            </>
          )}
        </form>
      </div>
    </div>
  );
};

export default RegisterScreen;