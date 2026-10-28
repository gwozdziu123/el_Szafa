/*
 * el_Szafa — biblioteka modułów
 * Plik: loxone.js
 * Loxone – Miniserver, Extensions i zasilacze 24 V DC na szynę DIN
 *
 * Jak dopisać pozycję: skopiuj jedną linię z listy items i zmień pola.
 *   id      – unikalny identyfikator (małe litery, bez spacji)
 *   type    – nazwa handlowa
 *   article – numer katalogowy Loxone
 *   width   – szerokość w modułach (Loxone: „division units”, 1 moduł = 18 mm)
 *   group   – nazwa sekcji w panelu biblioteki
 *   face    – napisy na froncie modułu w widoku szafy {label, sub}
 *   specs   – dane techniczne pokazywane we właściwościach
 *   visual  – rodzaj rysunku, gdy inny niż w nagłówku (np. "psu")
 *   prefix  – prefiks oznaczenia, gdy inny niż w nagłówku
 *   verify  – true, gdy szerokość lub numer wymaga sprawdzenia w karcie katalogowej
 * Szerokości 2 i 9 modułów potwierdzone w kartach katalogowych (pim.loxone.com).
 */
ElSzafa.registerLibrary({
  "id": "loxone",
  "name": "Loxone – automatyka budynkowa",
  "short": "Loxone",
  "manufacturer": "Loxone",
  "series": "Miniserver / Extensions",
  "category": "Loxone",
  "visual": "loxone",
  "prefix": "A",
  "color": { "body": "#eef0f1", "accent": "#69b42e", "terminal": "#7a828c" },
  "source": "Dane z kart katalogowych Loxone (pim.loxone.com).",
  "items": [
    {"id": "lox-miniserver", "type": "Miniserver", "article": "100335", "name": "Loxone Miniserver (Gen. 2)", "width": 9, "group": "Miniserver", "face": {"label": "Miniserver", "sub": "Gen. 2"}, "specs": {"Zasilanie": "24 V DC", "Wejścia cyfrowe": "8", "Wyjścia przekaźnikowe": "8 × 16 A", "Wejścia/wyjścia analogowe": "4 / 4 (0–10 V)", "Magistrale": "Loxone Link, Tree, Air", "Sieć": "Ethernet"}},
    {"id": "lox-miniserver-compact", "type": "Miniserver Compact", "article": "100512", "name": "Loxone Miniserver Compact", "width": 6, "group": "Miniserver", "face": {"label": "Miniserver", "sub": "Compact"}, "specs": {"Zasilanie": "10–30 V DC", "Wejścia cyfrowe": "4", "Wyjścia przekaźnikowe": "2 × 16 A", "Magistrale": "Loxone Link / Tree, Tree Turbo, Air", "Sieć": "Ethernet, USB"}},

    {"id": "lox-relay-ext", "type": "Relay Extension", "article": "100038", "name": "Loxone Relay Extension", "width": 9, "group": "Extensions – wejścia/wyjścia", "face": {"label": "Relay Ext.", "sub": "14 × 16 A"}, "specs": {"Wyjścia przekaźnikowe": "14 × 16 A (bezpotencjałowe)", "Obciążenie całkowite": "maks. 48 A", "Zasilanie": "24 V DC", "Magistrala": "Loxone Link"}},
    {"id": "lox-dimmer-ext", "type": "Dimmer Extension", "article": "100029", "name": "Loxone Dimmer Extension", "width": 9, "group": "Extensions – wejścia/wyjścia", "face": {"label": "Dimmer Ext.", "sub": "4 kanały"}, "specs": {"Wyjścia ściemniane": "4 × 230 V AC", "Wejścia cyfrowe": "8", "Zasilanie": "24 V DC", "Magistrala": "Loxone Link"}},
    {"id": "lox-di-ext", "type": "DI Extension", "article": "100283", "name": "Loxone DI Extension", "width": 2, "group": "Extensions – wejścia/wyjścia", "face": {"label": "DI", "sub": "20 wej."}, "specs": {"Wejścia cyfrowe": "20", "Zasilanie": "24 V DC", "Magistrala": "Loxone Link"}},
    {"id": "lox-ai-ext", "type": "AI Extension", "article": "100471", "name": "Loxone AI Extension", "width": 2, "group": "Extensions – wejścia/wyjścia", "face": {"label": "AI", "sub": "8 wej."}, "specs": {"Wejścia analogowe": "4 × napięciowe, 4 × prądowe", "Zakres": "0–10 V, 0/4–20 mA", "Zasilanie": "24 V DC", "Magistrala": "Loxone Link"}},
    {"id": "lox-ao-ext", "type": "AO Extension", "article": "100382", "name": "Loxone AO Extension", "width": 2, "group": "Extensions – wejścia/wyjścia", "face": {"label": "AO", "sub": "4 × 0–10 V"}, "specs": {"Wyjścia analogowe": "4 × 0–10 V", "Zasilanie": "24 V DC", "Magistrala": "Loxone Link"}},

    {"id": "lox-tree-ext", "type": "Tree Extension", "article": "100218", "name": "Loxone Tree Extension", "width": 2, "group": "Extensions – magistrale i komunikacja", "face": {"label": "Tree", "sub": "2 gałęzie"}, "specs": {"Gałęzie Tree": "2 (do 50 urządzeń każda)", "Zasilanie": "24 V DC", "Magistrala": "Loxone Link"}},
    {"id": "lox-air-base-ext", "type": "Air Base Extension", "article": "100114", "name": "Loxone Air Base Extension", "width": 2, "group": "Extensions – magistrale i komunikacja", "face": {"label": "Air", "sub": "868 MHz"}, "specs": {"Radio": "Loxone Air 868 MHz", "Zasilanie": "24 V DC", "Magistrala": "Loxone Link"}},
    {"id": "lox-modbus-ext", "type": "Modbus Extension", "article": "100124", "name": "Loxone Modbus Extension", "width": 2, "group": "Extensions – magistrale i komunikacja", "face": {"label": "Modbus", "sub": "RTU"}, "specs": {"Interfejs": "RS485, Modbus RTU", "Zasilanie": "24 V DC", "Magistrala": "Loxone Link"}},
    {"id": "lox-rs485-ext", "type": "RS485 Extension", "article": "100011", "name": "Loxone RS485 Extension", "width": 2, "group": "Extensions – magistrale i komunikacja", "face": {"label": "RS485", "sub": ""}, "specs": {"Interfejs": "RS485", "Zasilanie": "24 V DC", "Magistrala": "Loxone Link"}, "verify": true},
    {"id": "lox-rs232-ext", "type": "RS232 Extension", "article": "100013", "name": "Loxone RS232 Extension", "width": 2, "group": "Extensions – magistrale i komunikacja", "face": {"label": "RS232", "sub": ""}, "specs": {"Interfejs": "RS232", "Zasilanie": "24 V DC", "Magistrala": "Loxone Link"}, "verify": true},
    {"id": "lox-1wire-ext", "type": "1-Wire Extension", "article": "100014", "name": "Loxone 1-Wire Extension", "width": 2, "group": "Extensions – magistrale i komunikacja", "face": {"label": "1-Wire", "sub": ""}, "specs": {"Interfejs": "1-Wire", "Zasilanie": "24 V DC", "Magistrala": "Loxone Link"}, "verify": true},
    {"id": "lox-dmx-ext", "type": "DMX Extension", "article": "100012", "name": "Loxone DMX Extension", "width": 2, "group": "Extensions – magistrale i komunikacja", "face": {"label": "DMX", "sub": ""}, "specs": {"Interfejs": "DMX512", "Zasilanie": "24 V DC", "Magistrala": "Loxone Link"}, "verify": true},
    {"id": "lox-dali-ext", "type": "DALI Extension", "article": "100200", "name": "Loxone DALI Extension (64 urządzenia)", "width": 2, "group": "Extensions – magistrale i komunikacja", "face": {"label": "DALI", "sub": "64"}, "specs": {"Interfejs": "DALI, do 64 urządzeń", "Zasilanie": "24 V DC", "Magistrala": "Loxone Link"}, "verify": true},
    {"id": "lox-knx-ext", "type": "KNX Extension", "article": "100322", "name": "Loxone KNX Extension", "width": 2, "group": "Extensions – magistrale i komunikacja", "face": {"label": "KNX", "sub": ""}, "specs": {"Interfejs": "KNX TP", "Zasilanie": "24 V DC", "Magistrala": "Loxone Link"}, "verify": true},
    {"id": "lox-mbus-ext", "type": "M-Bus Extension", "article": "100569", "name": "Loxone M-Bus Extension", "width": 2, "group": "Extensions – magistrale i komunikacja", "face": {"label": "M-Bus", "sub": ""}, "specs": {"Interfejs": "M-Bus (liczniki)", "Zasilanie": "24 V DC", "Magistrala": "Loxone Link"}, "verify": true},

    {"id": "lox-psu-1-5a", "type": "Power Supply 24 V 1,5 A", "article": "200001", "name": "Zasilacz Loxone 24 V DC 1,5 A", "width": 2, "group": "Zasilacze 24 V DC", "visual": "psu", "prefix": "G", "face": {"label": "24V", "sub": "1,5 A"}, "specs": {"Napięcie wyjściowe": "24 V DC", "Prąd": "1,5 A (36 W)", "Zasilanie": "230 V AC"}},
    {"id": "lox-psu-4-2a", "type": "Power Supply 4.2A", "article": "100617", "name": "Zasilacz Loxone 24 V DC 4,2 A", "width": 2, "group": "Zasilacze 24 V DC", "visual": "psu", "prefix": "G", "face": {"label": "24V", "sub": "4,2 A"}, "specs": {"Napięcie wyjściowe": "24 V DC", "Prąd": "4,2 A (100 W)", "Zasilanie": "230 V AC"}},
    {"id": "lox-psu-4-2a-dsp", "type": "Power Supply 24 V 4,2 A", "article": "200002", "name": "Zasilacz Loxone 24 V DC 4,2 A (4 moduły)", "width": 4, "group": "Zasilacze 24 V DC", "visual": "psu", "prefix": "G", "face": {"label": "24V", "sub": "4,2 A"}, "specs": {"Napięcie wyjściowe": "24 V DC", "Prąd": "4,2 A (100 W)", "Zasilanie": "230 V AC"}},
    {"id": "lox-psu-backup", "type": "Power Supply & Backup", "article": "100401", "name": "Loxone Power Supply & Backup", "width": 18, "group": "Zasilacze 24 V DC", "visual": "psu", "prefix": "G", "face": {"label": "Power Supply & Backup", "sub": "24 V DC"}, "specs": {"Napięcie wyjściowe": "24 V DC", "Funkcja": "Zasilacz z podtrzymaniem akumulatorowym", "Szerokość": "18 modułów – wymaga rzędu min. 18 mod."}}
  ]
});
