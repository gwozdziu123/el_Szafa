/*
 * el_Szafa — biblioteka modułów
 * Plik: eaton-xpole-spd.js
 * Eaton xPole – ograniczniki przepięć: SPBT12 (typ 1+2, B+C) i SPCT2 (typ 2, C), Uc 280 V AC
 *
 * Jak dopisać pozycję: skopiuj jedną linię z listy items i zmień pola.
 *   id      – unikalny identyfikator (małe litery, bez spacji)
 *   type    – oznaczenie typu producenta
 *   article – numer katalogowy
 *   width   – szerokość w modułach (1 moduł = 18 mm)
 *   poles   – liczba wkładów rysowanych na froncie
 *   group   – nazwa sekcji w panelu biblioteki
 *   face    – napisy na froncie aparatu w widoku szafy {label, sub}
 *   specs   – dane techniczne pokazywane we właściwościach
 *   verify  – true, gdy numer katalogowy lub szerokość wymaga sprawdzenia w katalogu producenta
 */
ElSzafa.registerLibrary({
  "id": "eaton-xpole-spd",
  "name": "Eaton xPole – ograniczniki przepięć",
  "short": "Przepięciowe",
  "manufacturer": "Eaton",
  "series": "xPole SPBT12 / SPCT2",
  "category": "Eaton",
  "visual": "spd",
  "prefix": "FV",
  "color": {
    "body": "#e9ebee",
    "cartridge": "#f7f7f5",
    "accent": "#1d4ed8"
  },
  "source": "Numery katalogowe i szerokości wg stron produktów Eaton i kart katalogowych. Linia xPole Home nie ma własnych ograniczników – stosowane są SPBT12 (typ 1+2) i SPCT2 (typ 2) z rodziny xPole. Pozycje z verify:true sprawdź przed zamówieniem.",
  "items": [
    {"id": "eaton-spbt12-280-1", "type": "SPBT12-280/1", "article": "158306", "name": "Ogranicznik przepięć T1+T2 1P", "width": 1, "poles": 1, "group": "Typ 1+2 (B+C) · SPBT12", "face": {"label": "T1+2", "sub": "12,5kA"}, "specs": {"Klasa": "Typ 1+2 (B+C)", "Uc": "280 V AC", "Iimp (10/350)": "12,5 kA na biegun", "Up": "1,5 kV", "Bieguny": "1P"}},
    {"id": "eaton-spbt12-280-2", "type": "SPBT12-280/2", "article": "158309", "name": "Ogranicznik przepięć T1+T2 2P", "width": 2, "poles": 2, "group": "Typ 1+2 (B+C) · SPBT12", "face": {"label": "T1+2", "sub": "12,5kA"}, "specs": {"Klasa": "Typ 1+2 (B+C)", "Uc": "280 V AC", "Iimp (10/350)": "12,5 kA na biegun", "Up": "1,5 kV", "Bieguny": "2P"}},
    {"id": "eaton-spbt12-280-1npe", "type": "SPBT12-280-1+NPE", "article": "158308", "name": "Ogranicznik przepięć T1+T2 1P+N-PE", "width": 2, "poles": 2, "group": "Typ 1+2 (B+C) · SPBT12", "face": {"label": "T1+2", "sub": "1+NPE"}, "specs": {"Klasa": "Typ 1+2 (B+C)", "Uc": "280 V AC", "Iimp (10/350)": "12,5 kA na biegun", "Up": "1,5 kV", "Układ": "1P + N-PE (TN-S, TT)"}},
    {"id": "eaton-spbt12-280-3", "type": "SPBT12-280/3", "article": "158330", "name": "Ogranicznik przepięć T1+T2 3P", "width": 3, "poles": 3, "group": "Typ 1+2 (B+C) · SPBT12", "face": {"label": "T1+2", "sub": "12,5kA"}, "specs": {"Klasa": "Typ 1+2 (B+C)", "Uc": "280 V AC", "Iimp (10/350)": "12,5 kA na biegun", "Up": "1,5 kV", "Bieguny": "3P (TN-C)"}},
    {"id": "eaton-spbt12-280-4", "type": "SPBT12-280/4", "article": "158331", "name": "Ogranicznik przepięć T1+T2 4P", "width": 4, "poles": 4, "group": "Typ 1+2 (B+C) · SPBT12", "face": {"label": "T1+2", "sub": "12,5kA"}, "specs": {"Klasa": "Typ 1+2 (B+C)", "Uc": "280 V AC", "Iimp (10/350)": "12,5 kA na biegun", "Up": "1,5 kV", "Bieguny": "4P (TN-S)"}},
    {"id": "eaton-spbt12-280-3npe", "type": "SPBT12-280-3+NPE", "article": "158332", "name": "Ogranicznik przepięć T1+T2 3P+N-PE", "width": 4, "poles": 4, "group": "Typ 1+2 (B+C) · SPBT12", "face": {"label": "T1+2", "sub": "3+NPE"}, "specs": {"Klasa": "Typ 1+2 (B+C)", "Uc": "280 V AC", "Iimp (10/350)": "12,5 kA na biegun", "Up": "1,5 kV", "Układ": "3P + N-PE (TN-S, TT)"}, "verify": true},
    {"id": "eaton-spbt12-280-1npe50", "type": "SPBT12-280-1+NPE50", "article": "184752", "name": "Ogranicznik przepięć T1+T2 1P+N-PE (NPE 50 kA)", "width": 2, "poles": 2, "group": "Typ 1+2 (B+C) · SPBT12", "face": {"label": "T1+2", "sub": "1+NPE50"}, "specs": {"Klasa": "Typ 1+2 (B+C)", "Uc": "280 V AC", "Iimp (10/350)": "12,5 kA na biegun", "Up": "1,5 kV", "Układ": "1P + N-PE, iskiernik N-PE 50 kA (TT)"}, "verify": true},
    {"id": "eaton-spbt12-280-3npe50", "type": "SPBT12-280-3+NPE50", "article": "184750", "name": "Ogranicznik przepięć T1+T2 3P+N-PE (NPE 50 kA)", "width": 4, "poles": 4, "group": "Typ 1+2 (B+C) · SPBT12", "face": {"label": "T1+2", "sub": "3+NPE50"}, "specs": {"Klasa": "Typ 1+2 (B+C)", "Uc": "280 V AC", "Iimp (10/350)": "12,5 kA na biegun", "Up": "1,5 kV", "Układ": "3P + N-PE, iskiernik N-PE 50 kA (TT)"}, "verify": true},
    {"id": "eaton-spct2-280-1", "type": "SPCT2-280/1", "article": "167593", "name": "Ogranicznik przepięć T2 1P", "width": 1, "poles": 1, "group": "Typ 2 (C) · SPCT2", "face": {"label": "T2", "sub": "20kA"}, "specs": {"Klasa": "Typ 2 (C)", "Uc": "280 V AC", "In (8/20)": "20 kA", "Imax (8/20)": "40 kA", "Up": "1,4 kV", "Wkład": "wymienny SPCT2-280 (167592)", "Bieguny": "1P"}},
    {"id": "eaton-spct2-280-2", "type": "SPCT2-280/2", "article": "167594", "name": "Ogranicznik przepięć T2 2P", "width": 2, "poles": 2, "group": "Typ 2 (C) · SPCT2", "face": {"label": "T2", "sub": "20kA"}, "specs": {"Klasa": "Typ 2 (C)", "Uc": "280 V AC", "In (8/20)": "20 kA", "Imax (8/20)": "40 kA", "Up": "1,4 kV", "Wkład": "wymienny SPCT2-280 (167592)", "Bieguny": "2P"}},
    {"id": "eaton-spct2-280-1npe", "type": "SPCT2-280-1+NPE", "article": "167619", "name": "Ogranicznik przepięć T2 1P+N-PE", "width": 2, "poles": 2, "group": "Typ 2 (C) · SPCT2", "face": {"label": "T2", "sub": "1+NPE"}, "specs": {"Klasa": "Typ 2 (C)", "Uc": "280 V AC", "In (8/20)": "20 kA", "Imax (8/20)": "40 kA", "Up": "1,4 kV", "Wkład": "wymienny SPCT2-280 (167592)", "Układ": "1P + N-PE (TN-S, TT)"}},
    {"id": "eaton-spct2-280-3", "type": "SPCT2-280/3", "article": "167595", "name": "Ogranicznik przepięć T2 3P", "width": 3, "poles": 3, "group": "Typ 2 (C) · SPCT2", "face": {"label": "T2", "sub": "20kA"}, "specs": {"Klasa": "Typ 2 (C)", "Uc": "280 V AC", "In (8/20)": "20 kA", "Imax (8/20)": "40 kA", "Up": "1,4 kV", "Wkład": "wymienny SPCT2-280 (167592)", "Bieguny": "3P (TN-C)"}},
    {"id": "eaton-spct2-280-4", "type": "SPCT2-280/4", "article": "167596", "name": "Ogranicznik przepięć T2 4P", "width": 4, "poles": 4, "group": "Typ 2 (C) · SPCT2", "face": {"label": "T2", "sub": "20kA"}, "specs": {"Klasa": "Typ 2 (C)", "Uc": "280 V AC", "In (8/20)": "20 kA", "Imax (8/20)": "40 kA", "Up": "1,4 kV", "Wkład": "wymienny SPCT2-280 (167592)", "Bieguny": "4P (TN-S)"}},
    {"id": "eaton-spct2-280-3npe", "type": "SPCT2-280-3+NPE", "article": "167620", "name": "Ogranicznik przepięć T2 3P+N-PE", "width": 4, "poles": 4, "group": "Typ 2 (C) · SPCT2", "face": {"label": "T2", "sub": "3+NPE"}, "specs": {"Klasa": "Typ 2 (C)", "Uc": "280 V AC", "In (8/20)": "20 kA", "Imax (8/20)": "40 kA", "Up": "1,4 kV", "Wkład": "wymienny SPCT2-280 (167592)", "Układ": "3P + N-PE (TN-S, TT)"}}
  ]
});
