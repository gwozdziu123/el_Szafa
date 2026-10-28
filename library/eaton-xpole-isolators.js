/*
 * el_Szafa — biblioteka modułów
 * Plik: eaton-xpole-isolators.js
 * Eaton xPole – rozłączniki izolacyjne IS (stosowane z linią xPole Home)
 *
 * Jak dopisać pozycję: skopiuj jedną linię z listy items i zmień pola.
 *   id      – unikalny identyfikator (małe litery, bez spacji)
 *   type    – oznaczenie typu producenta
 *   article – numer katalogowy
 *   width   – szerokość w modułach (1 moduł = 18 mm)
 *   group   – nazwa sekcji w panelu biblioteki
 *   face    – napisy na froncie aparatu w widoku szafy {label, sub}
 *   specs   – dane techniczne pokazywane we właściwościach
 *   verify  – true, gdy numer katalogowy wymaga sprawdzenia w katalogu producenta
 * Pola wspólne (producent, kolor, rodzaj rysunku, prefiks oznaczenia) są w nagłówku biblioteki.
 */
ElSzafa.registerLibrary({
  "id": "eaton-xpole-isolators",
  "name": "Eaton xPole – rozłączniki izolacyjne IS",
  "short": "Rozłączniki",
  "manufacturer": "Eaton",
  "series": "xPole IS",
  "category": "Eaton",
  "visual": "isolator",
  "prefix": "QS",
  "color": {
    "body": "#f4f4f1",
    "lever": "#c62828",
    "accent": "#1d4ed8"
  },
  "source": "Linia xPole Home nie ma własnych rozłączników – stosowane są rozłączniki IS z rodziny xPole. Pozycje z verify:true mają numer wyznaczony z ciągu katalogowego – sprawdź przed zamówieniem.",
  "items": [
    {"id": "eaton-is-40-1", "type": "IS-40/1", "article": "276270", "name": "Rozłącznik izolacyjny 40 A 1P", "width": 1, "poles": 1, "group": "Rozłączniki 1P", "face": {"label": "40A", "sub": "0 – I"}, "specs": {"Prąd znamionowy": "40 A", "Bieguny": "1P", "Napięcie": "240/415 V AC"}, "verify": true},
    {"id": "eaton-is-40-2", "type": "IS-40/2", "article": "276271", "name": "Rozłącznik izolacyjny 40 A 2P", "width": 2, "poles": 2, "group": "Rozłączniki 2P", "face": {"label": "40A", "sub": "0 – I"}, "specs": {"Prąd znamionowy": "40 A", "Bieguny": "2P", "Napięcie": "240/415 V AC"}, "verify": true},
    {"id": "eaton-is-40-3", "type": "IS-40/3", "article": "276272", "name": "Rozłącznik izolacyjny 40 A 3P", "width": 3, "poles": 3, "group": "Rozłączniki 3P", "face": {"label": "40A", "sub": "0 – I"}, "specs": {"Prąd znamionowy": "40 A", "Bieguny": "3P", "Napięcie": "240/415 V AC"}},
    {"id": "eaton-is-40-4", "type": "IS-40/4", "article": "276273", "name": "Rozłącznik izolacyjny 40 A 4P", "width": 4, "poles": 4, "group": "Rozłączniki 4P", "face": {"label": "40A", "sub": "0 – I"}, "specs": {"Prąd znamionowy": "40 A", "Bieguny": "4P", "Napięcie": "240/415 V AC"}},
    {"id": "eaton-is-63-1", "type": "IS-63/1", "article": "276274", "name": "Rozłącznik izolacyjny 63 A 1P", "width": 1, "poles": 1, "group": "Rozłączniki 1P", "face": {"label": "63A", "sub": "0 – I"}, "specs": {"Prąd znamionowy": "63 A", "Bieguny": "1P", "Napięcie": "240/415 V AC"}, "verify": true},
    {"id": "eaton-is-63-2", "type": "IS-63/2", "article": "276275", "name": "Rozłącznik izolacyjny 63 A 2P", "width": 2, "poles": 2, "group": "Rozłączniki 2P", "face": {"label": "63A", "sub": "0 – I"}, "specs": {"Prąd znamionowy": "63 A", "Bieguny": "2P", "Napięcie": "240/415 V AC"}, "verify": true},
    {"id": "eaton-is-63-3", "type": "IS-63/3", "article": "276276", "name": "Rozłącznik izolacyjny 63 A 3P", "width": 3, "poles": 3, "group": "Rozłączniki 3P", "face": {"label": "63A", "sub": "0 – I"}, "specs": {"Prąd znamionowy": "63 A", "Bieguny": "3P", "Napięcie": "240/415 V AC"}},
    {"id": "eaton-is-63-4", "type": "IS-63/4", "article": "276277", "name": "Rozłącznik izolacyjny 63 A 4P", "width": 4, "poles": 4, "group": "Rozłączniki 4P", "face": {"label": "63A", "sub": "0 – I"}, "specs": {"Prąd znamionowy": "63 A", "Bieguny": "4P", "Napięcie": "240/415 V AC"}},
    {"id": "eaton-is-80-1", "type": "IS-80/1", "article": "276278", "name": "Rozłącznik izolacyjny 80 A 1P", "width": 1, "poles": 1, "group": "Rozłączniki 1P", "face": {"label": "80A", "sub": "0 – I"}, "specs": {"Prąd znamionowy": "80 A", "Bieguny": "1P", "Napięcie": "240/415 V AC"}, "verify": true},
    {"id": "eaton-is-80-2", "type": "IS-80/2", "article": "276279", "name": "Rozłącznik izolacyjny 80 A 2P", "width": 2, "poles": 2, "group": "Rozłączniki 2P", "face": {"label": "80A", "sub": "0 – I"}, "specs": {"Prąd znamionowy": "80 A", "Bieguny": "2P", "Napięcie": "240/415 V AC"}, "verify": true},
    {"id": "eaton-is-80-3", "type": "IS-80/3", "article": "276280", "name": "Rozłącznik izolacyjny 80 A 3P", "width": 3, "poles": 3, "group": "Rozłączniki 3P", "face": {"label": "80A", "sub": "0 – I"}, "specs": {"Prąd znamionowy": "80 A", "Bieguny": "3P", "Napięcie": "240/415 V AC"}, "verify": true},
    {"id": "eaton-is-80-4", "type": "IS-80/4", "article": "276281", "name": "Rozłącznik izolacyjny 80 A 4P", "width": 4, "poles": 4, "group": "Rozłączniki 4P", "face": {"label": "80A", "sub": "0 – I"}, "specs": {"Prąd znamionowy": "80 A", "Bieguny": "4P", "Napięcie": "240/415 V AC"}, "verify": true},
    {"id": "eaton-is-100-1", "type": "IS-100/1", "article": "276282", "name": "Rozłącznik izolacyjny 100 A 1P", "width": 1, "poles": 1, "group": "Rozłączniki 1P", "face": {"label": "100A", "sub": "0 – I"}, "specs": {"Prąd znamionowy": "100 A", "Bieguny": "1P", "Napięcie": "240/415 V AC"}, "verify": true},
    {"id": "eaton-is-100-2", "type": "IS-100/2", "article": "276283", "name": "Rozłącznik izolacyjny 100 A 2P", "width": 2, "poles": 2, "group": "Rozłączniki 2P", "face": {"label": "100A", "sub": "0 – I"}, "specs": {"Prąd znamionowy": "100 A", "Bieguny": "2P", "Napięcie": "240/415 V AC"}, "verify": true},
    {"id": "eaton-is-100-3", "type": "IS-100/3", "article": "276284", "name": "Rozłącznik izolacyjny 100 A 3P", "width": 3, "poles": 3, "group": "Rozłączniki 3P", "face": {"label": "100A", "sub": "0 – I"}, "specs": {"Prąd znamionowy": "100 A", "Bieguny": "3P", "Napięcie": "240/415 V AC"}},
    {"id": "eaton-is-100-4", "type": "IS-100/4", "article": "276285", "name": "Rozłącznik izolacyjny 100 A 4P", "width": 4, "poles": 4, "group": "Rozłączniki 4P", "face": {"label": "100A", "sub": "0 – I"}, "specs": {"Prąd znamionowy": "100 A", "Bieguny": "4P", "Napięcie": "240/415 V AC"}, "verify": true}
  ]
});
