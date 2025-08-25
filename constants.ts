import { v4 as uuidv4 } from 'uuid';

export const INITIAL_CATEGORIES: string[] = [
    "Choroby wewnętrzne",
    "Pediatria",
    "Chirurgia",
    "Ginekologia",
    "Medycyna rodzinna",
    "Psychiatria",
    "Medycyna ratunkowa i anestezjologia",
    "Bioetyka i prawo medyczne",
    "Zdrowie publiczne",
    "Orzecznictwo"
];


// The password_placeholder will be hashed on the first application run.
export const INITIAL_USERS: {id: string, name: string, login: string, password_placeholder: string}[] = [
    { id: uuidv4(), name: "Administrator", login: "admin", password_placeholder: "admin112" },
    { id: uuidv4(), name: "Ula", login: "ula", password_placeholder: "luniak" }
];
