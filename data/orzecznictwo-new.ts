export interface RawFlashcardWithOptions {
  index: number;
  category: string;
  question: string;
  options: {
    letter: string;
    text: string;
    status: 'pewna' | 'niejasna' | null;
  }[];
}

export const orzecznictwoNew: RawFlashcardWithOptions[] = [
    {
      "index": 13,
      "category": "Orzecznictwo > Przekrojowe",
      "question": "Okresy składkowe i nieskładkowe są uwzględniane przy ustalaniu prawa do emerytury i renty oraz obliczaniu jej wysokości. Zgodnie z ustawą z 17 grudnia 1998 r. o emeryturach i rentach z Funduszu Ubezpieczeń Społecznych do okresów nieskładkowych zalicza się okresy:",
      "options": [
        {
          "letter": "A",
          "text": "pobierania zasiłku przedemerytalnego i świadczenia przedemerytalnego",
          "status": "pewna"
        },
        {
          "letter": "B",
          "text": "pobierania zasiłku macierzyńskiego",
          "status": null
        },
        {
          "letter": "C",
          "text": "czynnej służby wojskowej w Wojsku Polskim",
          "status": null
        },
        {
          "letter": "D",
          "text": "osadzenia w więzieniach na terytorium Polski na mocy skazania lub bez skazania po 31.12.1955 r. za działalność polityczną",
          "status": null
        },
        {
          "letter": "E",
          "text": "pełnionej w Polsce służby w Biurze Ochrony Rządu",
          "status": null
        }
      ]
    },
    {
      "index": 12,
      "category": "Orzecznictwo > Orzekanie o niepełnosprawności",
      "question": "Pierwszą (I) grupę inwalidztwa żołnierzy ustala się żołnierzom:",
      "options": [
        {
          "letter": "A",
          "text": "całkowicie niezdolnym do służby, którzy są całkowicie niezdolni do pracy",
          "status": "pewna"
        },
        {
          "letter": "B",
          "text": "częściowo niezdolnym do służby, którzy są całkowicie niezdolni do pracy",
          "status": null
        },
        {
          "letter": "C",
          "text": "całkowicie niezdolnym do służby, którzy są częściowo niezdolni do pracy",
          "status": null
        },
        {
          "letter": "D",
          "text": "częściowo niezdolnym do służby, którzy są całkowicie niezdolni do pracy",
          "status": null
        },
        {
          "letter": "E",
          "text": "całkowicie niezdolnym do służby, którzy są zdolni do pracy",
          "status": null
        }
      ]
    },
    {
      "index": 11,
      "category": "Orzecznictwo > Inne",
      "question": "Lekarzy, będących tzw. stałymi biegłymi sądowymi, podlegających wpisowi na listę biegłych sądowych na okres 5 lat ustanawia:",
      "options": [
        {
          "letter": "A",
          "text": "prezes sądu rejonowego",
          "status": null
        },
        {
          "letter": "B",
          "text": "prezes sądu okręgowego",
          "status": "pewna"
        },
        {
          "letter": "C",
          "text": "prezes sądu apelacyjnego",
          "status": null
        },
        {
          "letter": "D",
          "text": "właściwa okręgowa izba lekarska",
          "status": null
        },
        {
          "letter": "E",
          "text": "naczelna Izba Lekarska",
          "status": null
        }
      ]
    },
    {
      "index": 10,
      "category": "Orzecznictwo > Orzekanie o niepełnosprawności",
      "question": "Zgodnie z ustawą z 27 sierpnia 1997 r. o rehabilitacji zawodowej i społecznej oraz zatrudnianiu osób niepełnosprawnych, nadzór nad orzekaniem o niepełnosprawności i o stopniu niepełnosprawności sprawuje:",
      "options": [
        {
          "letter": "A",
          "text": "wojewoda",
          "status": null
        },
        {
          "letter": "B",
          "text": "starosta",
          "status": null
        },
        {
          "letter": "C",
          "text": "wojewódzki sąd administracyjny",
          "status": null
        },
        {
          "letter": "D",
          "text": "minister właściwy do spraw zabezpieczenia społecznego",
          "status": null
        },
        {
          "letter": "E",
          "text": "pełnomocnik Rządu do Spraw Osób Niepełnosprawnych",
          "status": "pewna"
        }
      ]
    },
    {
      "index": 9,
      "category": "Orzecznictwo > Orzekanie o niepełnosprawności",
      "question": "Drugą (II) grupę inwalidztwa funkcjonariuszy Policji ustala się funkcjonariuszom:",
      "options": [
        {
          "letter": "A",
          "text": "częściowo niezdolnym do służby, którzy są częściowo niezdolni do pracy",
          "status": null
        },
        {
          "letter": "B",
          "text": "częściowo niezdolnym do służby, którzy są całkowicie niezdolni do pracy",
          "status": null
        },
        {
          "letter": "C",
          "text": "całkowicie niezdolnym do służby, którzy są częściowo niezdolni do pracy",
          "status": "pewna"
        },
        {
          "letter": "D",
          "text": "całkowicie niezdolnym do służby, którzy są zdolni do pracy",
          "status": null
        },
        {
          "letter": "E",
          "text": "całkowicie niezdolnym do służby, którzy są całkowicie niezdolni do pracy",
          "status": null
        }
      ]
    },
    {
      "index": 8,
      "category": "Orzecznictwo > Jednorazowe odszkodowanie",
      "question": "Lekarz orzecznik ZUS wydaje orzeczenie o stałym lub długotrwałym uszczerbku na zdrowiu. Orzeczenie zawiera następujące elementy:",
      "options": [
        {
          "letter": "A",
          "text": "procentowe ustalenie stopnia stałego lub długotrwałego uszczerbku na zdrowiu i numer pozycji w ocenie procentowej",
          "status": null
        },
        {
          "letter": "B",
          "text": "opis naruszenia sprawności organizmu ze wskazaniem rodzaju uszkodzenia organu, narządu lub układu i numer pozycji w ocenie procentowej",
          "status": null
        },
        {
          "letter": "C",
          "text": "opis rodzaju uszkodzenia organu, narządu lub układu ze wskazaniem, czy doszło do uszkodzeń wielomiejscowych i numer pozycji w ocenie procentowej",
          "status": null
        },
        {
          "letter": "D",
          "text": "opis naruszenia sprawności organizmu oraz procentowe ustalenie stopnia stałego lub długotrwałego uszczerbku na zdrowiu i numer pozycji w ocenie procentowej",
          "status": "pewna"
        },
        {
          "letter": "E",
          "text": "opis uszkodzenia organu, narządu lub układu, procentowe ustalenie stopnia stałego lub długotrwałego uszczerbku na zdrowiu, opinię lekarza konsultanta",
          "status": null
        }
      ]
    },
    {
      "index": 7,
      "category": "Orzecznictwo > Przymusowe ubezpieczenia społeczne i podatki",
      "question": "Na podstawie ustawy o ubezpieczeniu społecznym z tytułu wypadków przy pracy i chorób zawodowych z 30.10.2002 r., za zbiorowy wypadek przy pracy uważa się wypadek, któremu w wyniku tego samego zdarzenia uległy co najmniej:",
      "options": [
        {
          "letter": "A",
          "text": "2 osoby",
          "status": "pewna"
        },
        {
          "letter": "B",
          "text": "3 osoby",
          "status": null
        },
        {
          "letter": "C",
          "text": "4 osoby",
          "status": null
        },
        {
          "letter": "D",
          "text": "5 osób",
          "status": null
        },
        {
          "letter": "E",
          "text": "10 osób",
          "status": null
        }
      ]
    },
    {
      "index": 6,
      "category": "Orzecznictwo > Przymusowe ubezpieczenia społeczne i podatki",
      "question": "Odmowa przyznania świadczeń z ubezpieczenia wypadkowego, ze względu na nieprzedstawienie protokołu powypadkowego lub karty wypadku, na podstawie ustawy o ubezpieczeniu społecznym z tytułu wypadków przy pracy i chorób zawodowych z 30.10.2002 r., następuje w drodze:",
      "options": [
        {
          "letter": "A",
          "text": "postanowienia Zakładu Ubezpieczeń Społecznych",
          "status": null
        },
        {
          "letter": "B",
          "text": "decyzji Zakładu Ubezpieczeń Społecznych",
          "status": "pewna"
        },
        {
          "letter": "C",
          "text": "postanowienia Prezesa Zakładu Ubezpieczeń Społecznych",
          "status": null
        },
        {
          "letter": "D",
          "text": "decyzji Prezesa Zakładu Ubezpieczeń Społecznych",
          "status": null
        },
        {
          "letter": "E",
          "text": "orzeczenia lekarza orzecznika Zakładu Ubezpieczeń Społecznych",
          "status": null
        }
      ]
    },
    {
      "index": 5,
      "category": "Orzecznictwo > Inne",
      "question": "Badania profilaktyczne pracowników przy pracy związanej z posługiwaniem się bronią palną w przypadku pracowników po 60. roku życia przeprowadza się co:",
      "options": [
        {
          "letter": "A",
          "text": "6–12 miesięcy",
          "status": null
        },
        {
          "letter": "B",
          "text": "1–2 lata",
          "status": null
        },
        {
          "letter": "C",
          "text": "30 miesięcy",
          "status": "pewna"
        },
        {
          "letter": "D",
          "text": "2–4 lata",
          "status": null
        },
        {
          "letter": "E",
          "text": "5 lat",
          "status": null
        }
      ]
    },
    {
      "index": 4,
      "category": "Orzecznictwo > Ubezpieczenia społeczne rolników",
      "question": "Rada Ubezpieczenia Społecznego Rolników zwana „Radą Rolników”, reprezentująca interesy ogółu ubezpieczonych i świadczeniobiorców, dotyczące ubezpieczenia i działalności Kasy Rolniczego Ubezpieczenia Społecznego, powoływana jest przez ministra właściwego do spraw rozwoju wsi w liczbie:",
      "options": [
        {
          "letter": "A",
          "text": "3 członków",
          "status": null
        },
        {
          "letter": "B",
          "text": "5 członków",
          "status": null
        },
        {
          "letter": "C",
          "text": "15 członków",
          "status": null
        },
        {
          "letter": "D",
          "text": "20 członków",
          "status": null
        },
        {
          "letter": "E",
          "text": "25 członków",
          "status": "pewna"
        }
      ]
    },
    {
      "index": 3,
      "category": "Orzecznictwo > Zasiłek opiekuńczy",
      "question": "W sytuacji, gdy osobista opieka sprawowana jest nad chorym dzieckiem legitymującym się orzeczeniem o znacznym stopniu niepełnosprawności, zasiłek opiekuńczy przysługuje na okres:",
      "options": [
        {
          "letter": "A",
          "text": "nie dłuższy niż 14 dni w roku kalendarzowym",
          "status": null
        },
        {
          "letter": "B",
          "text": "nie dłuższy niż 30 dni w roku kalendarzowym",
          "status": "niejasna"
        },
        {
          "letter": "C",
          "text": "nie dłuższy niż 60 dni w roku kalendarzowym",
          "status": "niejasna"
        },
        {
          "letter": "D",
          "text": "dłuższy niż 30 dni w roku kalendarzowym",
          "status": null
        },
        {
          "letter": "E",
          "text": "dłuższy niż 60 dni w roku kalendarzowym",
          "status": null
        }
      ]
    },
    {
      "index": 2,
      "category": "Orzecznictwo > Przekrojowe",
      "question": "Świadczeniem pieniężnym z ubezpieczenia społecznego w razie choroby i macierzyństwa nie jest:",
      "options": [
        {
          "letter": "A",
          "text": "zasiłek opiekuńczy",
          "status": null
        },
        {
          "letter": "B",
          "text": "świadczenie rehabilitacyjne",
          "status": null
        },
        {
          "letter": "C",
          "text": "zasiłek pielęgnacyjny",
          "status": "pewna"
        },
        {
          "letter": "D",
          "text": "zasiłek wyrównawczy",
          "status": null
        },
        {
          "letter": "E",
          "text": "zasiłek chorobowy",
          "status": null
        }
      ]
    },
    {
      "index": 1,
      "category": "Orzecznictwo > Renta > Renta z tytułu niezdolności do pracy",
      "question": "Od orzeczenia lekarza orzecznika, ZUS o niezdolności do pracy, osobie zainteresowanej przysługuje sprzeciw, który wnosi się:",
      "options": [
        {
          "letter": "A",
          "text": "bezpośrednio do komisji lekarskiej",
          "status": null
        },
        {
          "letter": "B",
          "text": "do komisji lekarskiej za pośrednictwem jednostki organizacyjnej ZUS",
          "status": "pewna"
        },
        {
          "letter": "C",
          "text": "bezpośrednio do Prezesa ZUS",
          "status": null
        },
        {
          "letter": "D",
          "text": "do Prezesa ZUS za pośrednictwem jednostki organizacyjnej ZUS",
          "status": null
        },
        {
          "letter": "E",
          "text": "do komisji lekarskiej za pośrednictwem Prezesa ZUS",
          "status": null
         }
      ]
    }
];