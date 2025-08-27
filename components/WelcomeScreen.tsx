

import React, { useState } from 'react';
import { useFlashcards } from '../hooks/useFlashcards';
import FlipCard from './FlipCard';
import { Flashcard, User } from '../types';
import { AdminIcon } from './icons/MedicalIcons';

const demoCards: Omit<Flashcard, 'id' | 'category' | 'base' | 'createdAt'>[] = [
    {
        question: "Co to jest LEK?",
        answer: "Lekarski Egzamin Końcowy, państwowy egzamin weryfikujący wiedzę lekarzy i lekarzy dentystów przed uzyskaniem pełnego prawa wykonywania zawodu."
    },
    {
        question: "Jakie są główne działy na egzaminie LEK?",
        answer: "Choroby wewnętrzne, pediatria, chirurgia, ginekologia i położnictwo, psychiatria, medycyna ratunkowa, medycyna rodzinna, bioetyka, orzecznictwo, zdrowie publiczne."
    },
    {
        question: "Jaki jest próg zdawalności egzaminu LEK?",
        answer: "Aby zdać, należy uzyskać co najmniej 56% maksymalnej liczby punktów z testu."
    }
];

const DemoFlashcards: React.FC = () => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isFlipped, setIsFlipped] = useState(false);
    const [isAnimating, setIsAnimating] = useState(false);
    const [phase, setPhase] = useState<'selecting' | 'studying' | 'reviewing' | 'finished'>('selecting');

    const demoCategories = ["Choroby wewnętrzne", "Pediatria", "Chirurgia"];

    const handleStartDemo = () => {
        setCurrentIndex(0);
        setIsFlipped(false);
        setPhase('studying');
    };
    
    const handleResetDemo = () => {
         setPhase('selecting');
    }

    const handleAdvance = () => {
        if (isAnimating) return;
        setIsAnimating(true);
        setIsFlipped(false);
        
        setTimeout(() => {
            if (phase === 'studying') {
                if (currentIndex < demoCards.length - 1) {
                    setCurrentIndex(currentIndex + 1);
                } else {
                    // Mandatory review session of the second card
                    setPhase('reviewing');
                    setCurrentIndex(1); // Review card at index 1
                }
            } else if (phase === 'reviewing') {
                setPhase('finished');
            }
            setIsAnimating(false);
        }, 300); // Corresponds to FlipCard animation duration
    };

    if (phase === 'selecting') {
        return (
            <div className="flex flex-col items-center p-6 w-full">
                <h4 className="text-2xl font-bold text-slate-800 dark:text-slate-200 mb-6">Wybierz kategorię demonstracyjną</h4>
                <div className="flex flex-col sm:flex-row gap-4">
                    {demoCategories.map(cat => (
                        <button 
                            key={cat}
                            onClick={handleStartDemo}
                            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition-colors transform hover:scale-105"
                        >
                            {cat}
                        </button>
                    ))}
                </div>
            </div>
        );
    }

    if (phase === 'finished') {
        return (
            <div className="flex flex-col items-center p-8 text-center animate-fade-in-down w-full">
                <h4 className="text-2xl font-bold text-blue-600 dark:text-blue-400 mb-4">Koniec demonstracji!</h4>
                <p className="text-slate-600 dark:text-slate-400 mb-2">W pełnej wersji aplikacji system powtórek pomoże Ci utrwalić najtrudniejsze pytania.</p>
                <p className="text-slate-700 dark:text-slate-300 font-semibold mb-6">To tylko demonstracja, ale widzisz, jak łatwo można utrwalać wiedzę!</p>
                <p className="text-slate-500 dark:text-slate-400 mb-8">Zdobądź pełen dostęp, aby uczyć się z całej bazy pytań.</p>
                <button 
                    onClick={handleResetDemo}
                    className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-8 rounded-full transition-colors transform hover:scale-110"
                >
                    Spróbuj jeszcze raz
                </button>
            </div>
        );
    }

    const currentCard = { ...demoCards[currentIndex], id: `demo-${currentIndex}` };

    return (
        <div className="flex flex-col items-center w-full">
            {phase === 'reviewing' && (
                <div className="text-center mb-4 animate-fade-in-down">
                    <h4 className="text-xl font-semibold text-blue-600 dark:text-blue-400">Sesja powtórkowa</h4>
                    <p className="text-slate-500 dark:text-slate-400">A teraz powtórzmy pytanie, które mogło sprawić trudność.</p>
                </div>
            )}
            <div className="w-full max-w-2xl relative">
                {/* FIX: Added missing 'status' prop required by FlipCard component. */}
                <FlipCard
                    key={currentCard.id}
                    isFlipped={isFlipped}
                    setIsFlipped={setIsFlipped}
                    card={currentCard}
                    status="unseen"
                />
            </div>
             <div className="flex justify-center items-center gap-4 mt-6">
                <button 
                  onClick={handleAdvance}
                  className="text-white font-bold py-3 px-8 rounded-full text-lg transition-all transform hover:scale-110 shadow-lg bg-red-600 hover:bg-red-700 disabled:opacity-50"
                  aria-label="Nie znam, pokaż następną fiszkę"
                >
                  Nie znam
                </button>
                <button 
                  onClick={handleAdvance}
                  className="text-white font-bold py-3 px-8 rounded-full text-lg transition-all transform hover:scale-110 shadow-lg bg-green-600 hover:bg-green-700 disabled:opacity-50"
                  aria-label="Znam, pokaż następną fiszkę"
                >
                  Znam
                </button>
            </div>
        </div>
    );
};


const SubscriptionCard: React.FC<{ title: string, price: string, description: string, popular?: boolean }> = ({ title, price, description, popular }) => {
    return (
        <div className={`relative p-8 rounded-2xl shadow-lg flex flex-col transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-xl dark:hover:shadow-blue-500/20 ${popular ? 'bg-blue-600 text-white border-4 border-blue-400' : 'bg-white dark:bg-slate-800'}`}>
            {popular && <div className="absolute top-0 -translate-y-1/2 left-1/2 -translate-x-1/2 px-4 py-1 bg-blue-200 text-blue-800 font-bold text-sm rounded-full whitespace-nowrap">Najpopularniejsza</div>}
            <h3 className={`text-2xl font-bold ${popular ? 'text-white' : 'text-slate-800 dark:text-slate-200'}`}>{title}</h3>
            <p className={`text-4xl font-extrabold my-4 ${popular ? 'text-white' : 'text-slate-900 dark:text-white'}`}>{price}</p>
            <p className={`mb-6 flex-grow ${popular ? 'text-blue-100' : 'text-slate-600 dark:text-slate-400'}`}>{description}</p>
            <button
                disabled
                className="mt-auto font-bold py-3 px-6 rounded-lg bg-slate-300 dark:bg-slate-700 text-slate-500 dark:text-slate-400 cursor-not-allowed whitespace-nowrap"
            >
                Wkrótce dostępne
            </button>
        </div>
    );
};


const WelcomeScreen: React.FC<{ onLoginSuccess: (user: User) => void, onAdminClick: () => void, onRegisterClick: () => void }> = ({ onLoginSuccess, onAdminClick, onRegisterClick }) => {
    const { login: performLogin } = useFlashcards();
    const [login, setLogin] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        const user = await performLogin(login, password);
        if (user) {
            if (!user.isActive) {
                setError('Konto jest nieaktywne.');
                setTimeout(() => setError(''), 3000);
                return;
            }
            onLoginSuccess(user);
        } else {
            setError('Nieprawidłowy login lub hasło.');
            setTimeout(() => setError(''), 3000);
        }
    };

    return (
        <div className="bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-200 min-h-screen font-sans overflow-x-hidden">
            <style>{`
                @keyframes animate-fade-in-down {
                    0% { opacity: 0; transform: translateY(-20px); }
                    100% { opacity: 1; transform: translateY(0); }
                }
                .animate-fade-in-down {
                    animation: animate-fade-in-down 0.5s ease-out forwards;
                }
            `}</style>
            
            <nav className="absolute top-0 left-0 right-0 p-4 sm:p-6 flex justify-between items-center">
                 <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
                    Let's <span className="text-blue-600 dark:text-blue-500">LEK</span> this!
                </h1>
                <form onSubmit={handleLogin} className="hidden sm:flex items-center gap-2 mr-16">
                    <input type="text" value={login} onChange={e => setLogin(e.target.value)} placeholder="Login" aria-label="Login" className="p-2 rounded bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm" required />
                    <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Hasło" aria-label="Hasło" className="p-2 rounded bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm" required />
                    <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition-colors text-sm">Zaloguj</button>
                    <button type="button" onClick={onAdminClick} aria-label="Panel Administratora" className="p-2 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-600">
                      <AdminIcon className="w-5 h-5" />
                    </button>
                    {error && <p className="text-red-500 text-xs ml-2" role="alert">{error}</p>}
                </form>
            </nav>

            <main className="p-4 sm:p-6">
                <header className="text-center my-12 sm:my-20">
                    <h2 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                        Twoja interaktywna <span className="text-blue-600 dark:text-blue-500">baza fiszek</span> do egzaminu <span className="text-blue-600 dark:text-blue-500">LEK</span>
                    </h2>
                    <p className="mt-4 text-base sm:text-lg text-slate-600 dark:text-slate-400 max-w-3xl mx-auto">
                        Ucz się mądrzej, nie ciężej. Opanuj materiał dzięki tysiącom pytań w interaktywnej i przyjaznej formie, stworzonej z myślą o przyszłych lekarzach.
                    </p>
                </header>

                {/* Login Form for Mobile */}
                <form onSubmit={handleLogin} className="sm:hidden mb-12 bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-lg max-w-sm mx-auto flex flex-col gap-4">
                    <h3 className="text-xl font-bold text-center">Zaloguj się</h3>
                    <label htmlFor="login-mobile" className="sr-only">Login</label>
                    <input type="text" id="login-mobile" value={login} onChange={e => setLogin(e.target.value)} placeholder="Login" className="w-full p-3 rounded bg-slate-100 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500" required />
                     <label htmlFor="password-mobile" className="sr-only">Hasło</label>
                    <input type="password" id="password-mobile" value={password} onChange={e => setPassword(e.target.value)} placeholder="Hasło" className="w-full p-3 rounded bg-slate-100 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500" required />
                    <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg transition-colors">Zaloguj</button>
                    {error && <p className="text-red-500 text-sm text-center" role="alert">{error}</p>}
                    <div className="text-center text-sm mt-2">
                        <button type="button" onClick={onAdminClick} className="text-slate-500 dark:text-slate-400 hover:underline">Logowanie administratora</button>
                    </div>
                </form>
                
                <div className="text-center mb-12">
                  <p className="text-slate-600 dark:text-slate-400">
                      Nie masz konta?{' '}
                      <button onClick={onRegisterClick} className="font-bold text-blue-600 dark:text-blue-500 hover:underline">
                          Zarejestruj się
                      </button>
                  </p>
                </div>


                <section id="demo" aria-labelledby="demo-heading" className="my-12 sm:my-24 text-center">
                    <h3 id="demo-heading" className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white mb-4">Wypróbuj bez logowania</h3>
                    <p className="text-slate-600 dark:text-slate-400 mb-8 max-w-2xl mx-auto">Poczuj, jak działa mechanizm fiszek na kilku przykładowych pytaniach. Przekonaj się, jakie to proste i skuteczne.</p>
                     
                    <div className="max-w-4xl mx-auto mt-8 px-4">
                        <div className="bg-slate-800 dark:bg-black p-2 sm:p-3 rounded-t-xl shadow-2xl border-b-2 border-slate-700 dark:border-slate-600">
                            <div className="flex items-center gap-1.5 mb-2 px-2">
                                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                            </div>
                            <div className="bg-slate-50 dark:bg-slate-900 rounded-md min-h-[400px] sm:min-h-[480px] flex items-center justify-center p-4">
                                <DemoFlashcards />
                            </div>
                        </div>
                        <div className="relative h-6 bg-slate-300 dark:bg-slate-700 rounded-b-xl shadow-inner">
                            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-24 h-1 bg-slate-400/50 dark:bg-slate-800/50 rounded-full"></div>
                        </div>
                    </div>
                </section>

                <section id="subscriptions" aria-labelledby="subscriptions-heading" className="my-12 sm:my-24">
                    <div className="text-center">
                        <h3 id="subscriptions-heading" className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white mb-4">Wybierz plan dla siebie</h3>
                        <p className="text-slate-600 dark:text-slate-400 mb-12 max-w-2xl mx-auto">Pełen dostęp do wszystkich funkcji i tysięcy pytań. Ucz się bez ograniczeń i zdaj LEK z najlepszym wynikiem.</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
                        <SubscriptionCard title="Dzienny" price="10 zł" description="Idealna na ostatnią powtórkę przed egzaminem." />
                        <SubscriptionCard title="Tygodniowy" price="30 zł" description="Maksymalizuj efektywność nauki w krótkim czasie." />
                        <SubscriptionCard title="Miesięczny" price="50 zł" description="Pełny dostęp i stały postęp w przygotowaniach." popular />
                        <SubscriptionCard title="Roczny" price="250 zł" description="Najlepszy wybór dla pełnego cyklu przygotowań. Zaoszczędź i ucz się bez ograniczeń." />
                    </div>
                </section>

                <section id="about" aria-labelledby="about-heading" className="my-12 sm:my-24 bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-8 sm:p-12 max-w-5xl mx-auto">
                     <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
                        <div className="md:col-span-1 flex justify-center">
                            <img 
                                src="https://archive.org/download/1720818953499/1720818953499.jpg" 
                                alt="Patryk Nowicki, twórca aplikacji" 
                                className="w-48 h-48 rounded-full object-cover shadow-lg" 
                            />
                        </div>
                        <div className="md:col-span-2">
                            <h3 id="about-heading" className="text-3xl font-bold text-slate-900 dark:text-white mb-4">Projekt zrodzony z potrzeby serca</h3>
                            <p className="text-slate-600 dark:text-slate-400 mb-4">
                                Let's LEK this! to projekt, który zrodził się z potrzeby serca. Stworzyłem to narzędzie dla mojej żony, która przygotowując się do egzaminu, potrzebowała skutecznego wsparcia. Obserwowałem, z jakimi wyzwaniami się mierzy, i postanowiłem wykorzystać swoje doświadczenie, by stworzyć coś, co naprawdę pomoże. To właśnie ta historia stoi za każdym elementem tej aplikacji.
                            </p>
                            <p className="text-slate-600 dark:text-slate-400 mb-4">
                                Jestem <strong>Patryk Nowicki</strong>, Technical Product Manager. W mojej pracy z pasją łączę głęboką wiedzę inżynierską ze światem zarządzania produktem. Moją misją jest dbanie o to, aby każdy produkt był nie tylko zgodny z potrzebami rynku, ale również solidny pod względem technicznym. Specjalizuję się w całym cyklu życia produktu, od momentu, gdy pojawia się w głowie pierwszy pomysł, aż po ostateczne wdrożenie.
                            </p>
                            <p className="text-slate-600 dark:text-slate-400 mb-4">
                               W mojej filozofii działania cenię sobie ład i porządek, podchodząc do problemów szczerze i bezpośrednio. Wierzę, że prawdziwie ludzkie rozwiązania rodzą się z technicznego podejścia. Biegle posługuję się technologiami takimi jak C#, TypeScript i SQL.
                            </p>
                            <a href="https://www.linkedin.com/in/patryk-nowicki-01906b221/" target="_blank" rel="noopener noreferrer" className="font-bold text-blue-600 dark:text-blue-500 hover:text-blue-700 dark:hover:text-blue-400 transition-colors">
                                Mój profil LinkedIn &rarr;
                            </a>
                        </div>
                    </div>
                </section>
            </main>

            <footer className="text-center py-8 text-slate-500 dark:text-slate-400 text-sm border-t border-slate-200 dark:border-slate-700">
                <p>&copy; {new Date().getFullYear()} Let's LEK this! Stworzone przez Patryka Nowickiego.</p>
            </footer>
        </div>
    );
};

export default WelcomeScreen;