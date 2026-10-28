/*
 * el_Szafa — biblioteka modułów
 * Plik: phoenix-ptfix.js
 * Phoenix Contact – bloki rozdzielcze PTFIX z adapterem na szynę DIN (NS35 / NS35A), push-in 2,5 mm²
 *
 * Jak dopisać pozycję: skopiuj jedną linię z listy items i zmień pola.
 *   id      – unikalny identyfikator (małe litery, bez spacji)
 *   type    – oznaczenie typu producenta (z kolorem: GY szary, BU niebieski, GN zielony, OG, RD, BK, PK)
 *   article – numer katalogowy
 *   width   – zajmowane miejsce na szynie w modułach (1 moduł = 18 mm, zaokrąglone w górę)
 *   conns   – liczba zacisków 2,5 mm² (rysowane jako otwory)
 *   big     – liczba dużych zacisków 6 mm² (zasilanie bloku)
 *   color   – {"body": kolor obudowy}
 *   group   – nazwa sekcji w panelu biblioteki
 *   face    – napisy na polu opisowym {label, sub}
 *   specs   – dane techniczne pokazywane we właściwościach
 *   verify  – true, gdy numer katalogowy lub szerokość wymaga sprawdzenia
 */
ElSzafa.registerLibrary({
  "id": "phoenix-ptfix",
  "name": "Phoenix Contact – bloki rozdzielcze PTFIX",
  "short": "PTFIX",
  "manufacturer": "Phoenix Contact",
  "series": "PTFIX (push-in)",
  "category": "Phoenix Contact",
  "visual": "distblock",
  "prefix": "X",
  "color": {
    "body": "#a3a8b0"
  },
  "source": "Numery katalogowe i wymiary wg stron produktów i kart katalogowych Phoenix Contact. Szerokość na szynie zaokrąglona w górę do pełnych modułów: 6X2,5 ma 16 mm (1 moduł), 12X2,5 i 6/18X2,5 mają 28,6 mm (2 moduły). Pozycje z verify:true mają szerokość przyjętą przez analogię – sprawdź.",
  "items": [
    {"id": "ptfix-6x25-gy", "type": "PTFIX 6X2,5-NS35 GY", "article": "3273000", "name": "Blok rozdzielczy PTFIX 6×2,5 mm² (szary)", "width": 1, "group": "Mocowanie NS35", "conns": 6, "big": 0, "color": {"body": "#a3a8b0"}, "face": {"label": "6×2,5", "sub": "GY"}, "specs": {"Przyłącza": "6 × 2,5 mm²", "Potencjały": "1", "Prąd znamionowy": "24 A (2,5 mm²)", "Napięcie": "690 V", "Przekrój przewodu": "0,14–4 mm²", "Technika": "push-in", "Kolor": "szary", "Montaż": "szyna NS 35/7,5 i NS 35/15 (NS35)"}, "verify": true},
    {"id": "ptfix-6x25-bu", "type": "PTFIX 6X2,5-NS35 BU", "article": "3273002", "name": "Blok rozdzielczy PTFIX 6×2,5 mm² (niebieski)", "width": 1, "group": "Mocowanie NS35", "conns": 6, "big": 0, "color": {"body": "#2f6fd6"}, "face": {"label": "6×2,5", "sub": "BU"}, "specs": {"Przyłącza": "6 × 2,5 mm²", "Potencjały": "1", "Prąd znamionowy": "24 A (2,5 mm²)", "Napięcie": "690 V", "Przekrój przewodu": "0,14–4 mm²", "Technika": "push-in", "Kolor": "niebieski", "Montaż": "szyna NS 35/7,5 i NS 35/15 (NS35)"}, "verify": true},
    {"id": "ptfix-6x25-gn", "type": "PTFIX 6X2,5-NS35 GN", "article": "3273008", "name": "Blok rozdzielczy PTFIX 6×2,5 mm² (zielony)", "width": 1, "group": "Mocowanie NS35", "conns": 6, "big": 0, "color": {"body": "#2e9e4f"}, "face": {"label": "6×2,5", "sub": "GN"}, "specs": {"Przyłącza": "6 × 2,5 mm²", "Potencjały": "1", "Prąd znamionowy": "24 A (2,5 mm²)", "Napięcie": "690 V", "Przekrój przewodu": "0,14–4 mm²", "Technika": "push-in", "Kolor": "zielony", "Montaż": "szyna NS 35/7,5 i NS 35/15 (NS35)"}, "verify": true},
    {"id": "ptfix-6x25-og", "type": "PTFIX 6X2,5-NS35 OG", "article": "3273018", "name": "Blok rozdzielczy PTFIX 6×2,5 mm² (pomarańczowy)", "width": 1, "group": "Mocowanie NS35", "conns": 6, "big": 0, "color": {"body": "#f08a24"}, "face": {"label": "6×2,5", "sub": "OG"}, "specs": {"Przyłącza": "6 × 2,5 mm²", "Potencjały": "1", "Prąd znamionowy": "24 A (2,5 mm²)", "Napięcie": "690 V", "Przekrój przewodu": "0,14–4 mm²", "Technika": "push-in", "Kolor": "pomarańczowy", "Montaż": "szyna NS 35/7,5 i NS 35/15 (NS35)"}, "verify": true},
    {"id": "ptfix-12x25-pk", "type": "PTFIX 12X2,5-NS35 PK", "article": "3273039", "name": "Blok rozdzielczy PTFIX 12×2,5 mm² (różowy)", "width": 2, "group": "Mocowanie NS35", "conns": 12, "big": 0, "color": {"body": "#d9a3b4"}, "face": {"label": "12×2,5", "sub": "PK"}, "specs": {"Przyłącza": "12 × 2,5 mm²", "Potencjały": "1", "Prąd znamionowy": "24 A (2,5 mm²)", "Napięcie": "690 V", "Przekrój przewodu": "0,14–4 mm²", "Technika": "push-in", "Kolor": "różowy", "Montaż": "szyna NS 35/7,5 i NS 35/15 (NS35)"}},
    {"id": "ptfix-6-12x25-bu", "type": "PTFIX 6/12X2,5-NS35 BU", "article": "3273090", "name": "Blok rozdzielczy PTFIX 12×2,5 + 1×6 mm² (niebieski)", "width": 2, "group": "Mocowanie NS35", "conns": 12, "big": 1, "color": {"body": "#2f6fd6"}, "face": {"label": "12×2,5 + 1×6", "sub": "BU"}, "specs": {"Przyłącza": "12 × 2,5 mm², 1 × 6 mm²", "Potencjały": "1", "Prąd znamionowy": "24 A (2,5 mm²), 57 A (6 mm²)", "Napięcie": "690 V", "Przekrój przewodu": "0,14–4 mm² (6 mm² dla dużego zacisku)", "Technika": "push-in", "Kolor": "niebieski", "Montaż": "szyna NS 35/7,5 i NS 35/15 (NS35)"}, "verify": true},
    {"id": "ptfix-6-18x25-gy", "type": "PTFIX 6/18X2,5-NS35 GY", "article": "3273110", "name": "Blok rozdzielczy PTFIX 18×2,5 + 1×6 mm² (szary)", "width": 2, "group": "Mocowanie NS35", "conns": 18, "big": 1, "color": {"body": "#a3a8b0"}, "face": {"label": "18×2,5 + 1×6", "sub": "GY"}, "specs": {"Przyłącza": "18 × 2,5 mm², 1 × 6 mm²", "Potencjały": "1", "Prąd znamionowy": "24 A (2,5 mm²), 57 A (6 mm²)", "Napięcie": "690 V", "Przekrój przewodu": "0,14–4 mm² (6 mm² dla dużego zacisku)", "Technika": "push-in", "Kolor": "szary", "Montaż": "szyna NS 35/7,5 i NS 35/15 (NS35)"}},
    {"id": "ptfix-6-18x25-gn", "type": "PTFIX 6/18X2,5-NS35 GN", "article": "3273118", "name": "Blok rozdzielczy PTFIX 18×2,5 + 1×6 mm² (zielony)", "width": 2, "group": "Mocowanie NS35", "conns": 18, "big": 1, "color": {"body": "#2e9e4f"}, "face": {"label": "18×2,5 + 1×6", "sub": "GN"}, "specs": {"Przyłącza": "18 × 2,5 mm², 1 × 6 mm²", "Potencjały": "1", "Prąd znamionowy": "24 A (2,5 mm²), 57 A (6 mm²)", "Napięcie": "690 V", "Przekrój przewodu": "0,14–4 mm² (6 mm² dla dużego zacisku)", "Technika": "push-in", "Kolor": "zielony", "Montaż": "szyna NS 35/7,5 i NS 35/15 (NS35)"}},
    {"id": "ptfix-6-18x25-og", "type": "PTFIX 6/18X2,5-NS35 OG", "article": "3273128", "name": "Blok rozdzielczy PTFIX 18×2,5 + 1×6 mm² (pomarańczowy)", "width": 2, "group": "Mocowanie NS35", "conns": 18, "big": 1, "color": {"body": "#f08a24"}, "face": {"label": "18×2,5 + 1×6", "sub": "OG"}, "specs": {"Przyłącza": "18 × 2,5 mm², 1 × 6 mm²", "Potencjały": "1", "Prąd znamionowy": "24 A (2,5 mm²), 57 A (6 mm²)", "Napięcie": "690 V", "Przekrój przewodu": "0,14–4 mm² (6 mm² dla dużego zacisku)", "Technika": "push-in", "Kolor": "pomarańczowy", "Montaż": "szyna NS 35/7,5 i NS 35/15 (NS35)"}},
    {"id": "ptfix-a-6x25-rd", "type": "PTFIX 6X2,5-NS35A RD", "article": "3273136", "name": "Blok rozdzielczy PTFIX 6×2,5 mm² (czerwony)", "width": 1, "group": "Mocowanie NS35A", "conns": 6, "big": 0, "color": {"body": "#d63a3a"}, "face": {"label": "6×2,5", "sub": "RD"}, "specs": {"Przyłącza": "6 × 2,5 mm²", "Potencjały": "1", "Prąd znamionowy": "24 A (2,5 mm²)", "Napięcie": "690 V", "Przekrój przewodu": "0,14–4 mm²", "Technika": "push-in", "Kolor": "czerwony", "Montaż": "szyna NS 35/7,5 i NS 35/15 (NS35A)"}},
    {"id": "ptfix-a-6x25-bk", "type": "PTFIX 6X2,5-NS35A BK", "article": "3273146", "name": "Blok rozdzielczy PTFIX 6×2,5 mm² (czarny)", "width": 1, "group": "Mocowanie NS35A", "conns": 6, "big": 0, "color": {"body": "#2b2f36"}, "face": {"label": "6×2,5", "sub": "BK"}, "specs": {"Przyłącza": "6 × 2,5 mm²", "Potencjały": "1", "Prąd znamionowy": "24 A (2,5 mm²)", "Napięcie": "690 V", "Przekrój przewodu": "0,14–4 mm²", "Technika": "push-in", "Kolor": "czarny", "Montaż": "szyna NS 35/7,5 i NS 35/15 (NS35A)"}},
    {"id": "ptfix-a-6-6x25-bu", "type": "PTFIX 6/6X2,5-NS35A BU", "article": "3273200", "name": "Blok rozdzielczy PTFIX 6×2,5 + 1×6 mm² (niebieski)", "width": 1, "group": "Mocowanie NS35A", "conns": 6, "big": 1, "color": {"body": "#2f6fd6"}, "face": {"label": "6×2,5 + 1×6", "sub": "BU"}, "specs": {"Przyłącza": "6 × 2,5 mm², 1 × 6 mm²", "Potencjały": "1", "Prąd znamionowy": "24 A (2,5 mm²), 57 A (6 mm²)", "Napięcie": "690 V", "Przekrój przewodu": "0,14–4 mm² (6 mm² dla dużego zacisku)", "Technika": "push-in", "Kolor": "niebieski", "Montaż": "szyna NS 35/7,5 i NS 35/15 (NS35A)"}, "verify": true},
    {"id": "ptfix-a-6-12x25-gn", "type": "PTFIX 6/12X2,5-NS35A GN", "article": "3273228", "name": "Blok rozdzielczy PTFIX 12×2,5 + 1×6 mm² (zielony)", "width": 2, "group": "Mocowanie NS35A", "conns": 12, "big": 1, "color": {"body": "#2e9e4f"}, "face": {"label": "12×2,5 + 1×6", "sub": "GN"}, "specs": {"Przyłącza": "12 × 2,5 mm², 1 × 6 mm²", "Potencjały": "1", "Prąd znamionowy": "24 A (2,5 mm²), 57 A (6 mm²)", "Napięcie": "690 V", "Przekrój przewodu": "0,14–4 mm² (6 mm² dla dużego zacisku)", "Technika": "push-in", "Kolor": "zielony", "Montaż": "szyna NS 35/7,5 i NS 35/15 (NS35A)"}, "verify": true}
  ]
});
