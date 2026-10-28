# el_Szafa – projektowanie rozdzielnic modułowych

Aplikacja webowa (PWA) do układania aparatów modułowych na szynach DIN: dobór rozmiaru szafy, biblioteka Eaton xPole Home i Loxone, opisy obwodów, lista materiałów, wydruk.

## Uruchomienie

- **Najprościej:** otwórz `index.html` w przeglądarce (Chrome, Edge, Firefox). Działa bez serwera; projekty zapisują się w tej przeglądarce.
- **Jako aplikacja (PWA, offline):** wrzuć cały folder na hosting HTTPS (np. GitHub Pages) albo uruchom serwer lokalny w folderze:
  `python -m http.server 8080` → `http://localhost:8080`. W pasku adresu pojawi się „Zainstaluj aplikację”.

## Obsługa

- **Dodawanie:** kliknij aparat w bibliotece (lub „+”) – trafia w pierwsze wolne miejsce albo za zaznaczony aparat. Kliknięte wolne pole na szynie wskazuje, gdzie wstawić następny.
- **Przeciąganie:** przeciągnij aparat z biblioteki na szynę albo przesuń aparat w szafie (także między rzędami). Gdy miejsce jest zajęte, kolejne aparaty przesuwają się w prawo.
- **Właściwości:** kliknij aparat – oznaczenie, opis obwodu, przewód, uwagi, dane techniczne.
- **Szafa:** gotowe rozmiary (1–6 rzędów × 6–24 moduły) lub własny; „Zalecana” dobiera najmniejszą szafę z rezerwą (domyślnie 20%). Aparaty, które się nie mieszczą, czekają w sekcji „Poza szafą”.
- **Skróty:** Ctrl+Z / Ctrl+Y – cofnij / ponów, Delete – usuń, ← → – przesuń, Ctrl+D – duplikuj, Ctrl+P – drukuj, Esc – odznacz.
- **Pliki:** eksport/import projektu `.json`, lista materiałów i zestawienie obwodów do CSV (Excel), wydruk/PDF (A4 poziomo).

## Biblioteka – rozbudowa

Każda grupa aparatów to osobny plik w `library/`:

| Plik | Zawartość |
|---|---|
| `index.js` | spis plików biblioteki (kolejność = kolejność w panelu) |
| `enclosures.js` | rozmiary szaf |
| `eaton-xpole-home-mcb.js` | wyłączniki nadprądowe HN, B i C, 6–63 A, 1P / 1P+N / 2P / 3P / 3P+N |
| `eaton-xpole-home-rcd.js` | różnicowoprądowe HNC 2P/4P (typ A i AC) i RCBO HNB 1P+N |
| `eaton-xpole-isolators.js` | rozłączniki izolacyjne IS 40–100 A, 1–4P |
| `eaton-xpole-spd.js` | ograniczniki przepięć SPBT12 (typ 1+2) i SPCT2 (typ 2) |
| `zamel.js` | lampka kontrolna LKM-09-40, czujnik faz CKM-11 |
| `phoenix-ptfix.js` | bloki rozdzielcze Phoenix Contact PTFIX (push-in) |
| `loxone.js` | Miniserver, Extensions, zasilacze 24 V DC |

Nowy plik: skopiuj istniejący, zmień nagłówek (`id`, `name`, `short`, `visual`, `prefix`, `color`) i pozycje, dopisz nazwę w `index.js`, a w `sw.js` podnieś `CACHE_VERSION`.
Rodzaje rysunku (`visual`): `breaker`, `rcd`, `isolator`, `spd`, `indicator`, `distblock`, `loxone`, `psu`, `generic`.

Pozycje z `verify: true` (w aplikacji etykieta „sprawdź”) mają numer katalogowy lub szerokość do potwierdzenia w karcie producenta.
Linia xPole Home nie ma własnych rozłączników ani ograniczników przepięć – w bibliotece są rozłączniki IS oraz ograniczniki SPBT12 / SPCT2 z rodziny Eaton xPole.

## GitHub Pages

W folderze jest pusty plik `.nojekyll` – wyłącza przetwarzanie Jekyll, które pomija pliki zaczynające się od podkreślnika. Nie usuwaj go. Nazwy plików biblioteki nie powinny zaczynać się od `_`.

## Struktura

```
index.html, manifest.webmanifest, sw.js
css/   tokens.css (kolory, odstępy), components.css (komponenty systemu el_Fuszka), app.css
js/    core.js (stan, zapis, historia), cabinet.js (rozmieszczanie), render-module.js (rysunek aparatów),
       ui-*.js (interfejs), bom-print.js (lista, CSV, wydruk), app.js (start, PWA)
library/  pliki biblioteki
icons/    ikony aplikacji
```
