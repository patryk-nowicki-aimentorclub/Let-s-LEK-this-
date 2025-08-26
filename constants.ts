import { v4 as uuidv4 } from 'uuid';

export const INITIAL_CATEGORIES: string[] = [
    "Bioetyka i prawo medyczne",
    "Chirurgia",
    "Ginekologia i położnictwo",
    "Interna",
    "Medycyna rodzinna",
    "Medycyna ratunkowa i intensywna terapia",
    "Orzecznictwo",
    "Pediatria",
    "Psychiatria",
    "Zdrowie publiczne"
];


// The password_placeholder will be hashed on the first application run.
export const INITIAL_USERS: {id: string, name: string, login: string, password_placeholder: string}[] = [
    { id: uuidv4(), name: "Administrator", login: "admin", password_placeholder: "admin112" },
    { id: uuidv4(), name: "Ula", login: "ula", password_placeholder: "luniak" },
    { id: uuidv4(), name: "Test User", login: "test", password_placeholder: "test112" }
];