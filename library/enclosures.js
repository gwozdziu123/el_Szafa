/*
 * el_Szafa — biblioteka rozmiarów szaf (rozdzielnic modułowych)
 * Plik: enclosures.js
 *
 * Najpopularniejsze układy rozdzielnic natynkowych i podtynkowych:
 * rzędy × moduły w rzędzie (1 moduł = 18 mm).
 * Jak dopisać rozmiar: skopiuj linię i zmień pola.
 *   id      – unikalny identyfikator
 *   name    – nazwa wyświetlana na liście
 *   rows    – liczba rzędów (szyn DIN)
 *   modules – liczba modułów w rzędzie
 *   note    – krótki opis zastosowania
 */
ElSzafa.registerEnclosures([
  {"id": "1x6",  "name": "1 × 6",  "rows": 1, "modules": 6,  "note": "Mała rozdzielnica – garaż, altana"},
  {"id": "1x8",  "name": "1 × 8",  "rows": 1, "modules": 8,  "note": "Mała rozdzielnica"},
  {"id": "1x12", "name": "1 × 12", "rows": 1, "modules": 12, "note": "Mieszkanie – podstawowa"},
  {"id": "2x12", "name": "2 × 12", "rows": 2, "modules": 12, "note": "Mieszkanie"},
  {"id": "3x12", "name": "3 × 12", "rows": 3, "modules": 12, "note": "Mieszkanie / mały dom"},
  {"id": "4x12", "name": "4 × 12", "rows": 4, "modules": 12, "note": "Dom jednorodzinny"},
  {"id": "1x18", "name": "1 × 18", "rows": 1, "modules": 18, "note": "Rozdzielnica piętrowa"},
  {"id": "2x18", "name": "2 × 18", "rows": 2, "modules": 18, "note": "Dom jednorodzinny"},
  {"id": "3x18", "name": "3 × 18", "rows": 3, "modules": 18, "note": "Dom jednorodzinny"},
  {"id": "4x18", "name": "4 × 18", "rows": 4, "modules": 18, "note": "Dom z automatyką"},
  {"id": "5x18", "name": "5 × 18", "rows": 5, "modules": 18, "note": "Dom z automatyką"},
  {"id": "2x24", "name": "2 × 24", "rows": 2, "modules": 24, "note": "Rozdzielnica przemysłowa / smart home"},
  {"id": "3x24", "name": "3 × 24", "rows": 3, "modules": 24, "note": "Smart home (Loxone)"},
  {"id": "4x24", "name": "4 × 24", "rows": 4, "modules": 24, "note": "Smart home (Loxone)"},
  {"id": "5x24", "name": "5 × 24", "rows": 5, "modules": 24, "note": "Duży dom z automatyką"},
  {"id": "6x24", "name": "6 × 24", "rows": 6, "modules": 24, "note": "Duży dom z automatyką"}
]);
