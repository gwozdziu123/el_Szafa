/*
 * el_Szafa — biblioteka modułów
 * Plik: zamel.js
 * Zamel (seria Exta) – lampki kontrolne i czujniki kontroli faz na szynę DIN
 *
 * Jak dopisać pozycję: skopiuj jedną linię z listy items i zmień pola.
 *   id      – unikalny identyfikator (małe litery, bez spacji)
 *   type    – oznaczenie typu producenta
 *   article – numer katalogowy (EXT…)
 *   width   – szerokość w modułach (1 moduł = 18 mm)
 *   group   – nazwa sekcji w panelu biblioteki
 *   face    – napisy na froncie aparatu w widoku szafy {label, sub}
 *   leds    – kolory diod na froncie (rysunek "indicator")
 *   fuses   – liczba gniazd bezpiecznikowych na froncie (0 = brak)
 *   specs   – dane techniczne pokazywane we właściwościach
 *   prefix  – prefiks oznaczenia, gdy inny niż w nagłówku
 *   verify  – true, gdy numer katalogowy lub szerokość wymaga sprawdzenia
 */
ElSzafa.registerLibrary({
  "id": "zamel",
  "name": "Zamel – lampki i czujniki faz",
  "short": "Zamel",
  "manufacturer": "Zamel",
  "series": "Exta",
  "category": "Zamel",
  "visual": "indicator",
  "prefix": "H",
  "color": { "body": "#f5f5f3", "accent": "#e30613" },
  "source": "Dane ze stron produktów Zamel i dystrybutorów (Onninen).",
  "items": [
    {"id": "zamel-lkm-09-40", "type": "LKM-09-40", "article": "EXT10000318", "name": "Lampka kontrolna 3-fazowa z bezpiecznikami", "width": 1, "group": "Lampki kontrolne", "leds": ["#facc15", "#22c55e", "#ef4444"], "fuses": 0, "face": {"label": "LKM", "sub": "6,3 A"}, "specs": {"Funkcja": "Sygnalizacja napięcia w każdej fazie, dioda gaśnie po przepaleniu bezpiecznika", "Sieć": "3-fazowa TN, 230/400 V AC", "Diody": "żółta / zielona / czerwona (L1 / L2 / L3)", "Zabezpieczenie": "wkładki bezpiecznikowe, maks. 6,3 A", "Montaż": "szyna TH-35"}},
    {"id": "zamel-ckm-11", "type": "CKM-11", "article": "EXT10000267", "name": "Czujnik kolejności i zaniku faz cyfrowy 16 A", "width": 2, "group": "Czujniki kontroli faz", "prefix": "K", "leds": ["#facc15", "#22c55e", "#ef4444", "#22c55e"], "fuses": 0, "face": {"label": "CKM-11", "sub": "16 A"}, "specs": {"Zasilanie": "230/400 V AC, 50/60 Hz (L1, L2, L3, N)", "Funkcje": "zanik fazy, asymetria (55 V), kolejność faz, spadek napięcia < 150 V", "Styk": "1 przełączny, 16 A", "Histereza": "ok. 10 V", "Opóźnienie": "załączenie ok. 2 s, wyłączenie ok. 4 s", "Sygnalizacja": "diody faz L1/L2/L3, dioda kolejności (zielona – poprawna, żółta – błędna)"}}
  ]
});
