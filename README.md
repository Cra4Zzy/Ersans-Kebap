# Ersan’s Kebap – Website

Individuelle statische Website für Ersan’s Kebap in Dinkelsbühl. Der Auftritt wurde am 15.10.2026 umfassend überarbeitet: warme helle Flächen, tiefer Petrolton, lokale Serifenschrift, gezielt gesetzte Food-Fotografie und echte Bilder aus dem Laden.

## Seiten und Funktionen

- Startseite mit interaktiver Gerichtsauswahl, manuell steuerbaren Gästestimmen und Öffnungsstatus für Europe/Berlin.
- Vollständige Speisekarte mit 64 Einträgen, Preisen, Suche und Kategorien. Die bisherigen Preise und Kennzeichnungen wurden übernommen. Die gemischte Gruppe mit Pide und Beilagen wird nicht mehr irreführend als ausschließlich vegetarisch bezeichnet.
- Geschichte des Betriebs mit Originalfotos und einer Tastatur-bedienbaren Galerie.
- Kontakt und Vorbestellung über den bereits vorhandenen Formspree-Endpunkt. Echte Serverrückmeldung, Schutz gegen Doppelklicks, Fehleranzeige ohne Verlust der Eingaben. Eine Anfrage ist erst nach persönlicher Bestätigung angenommen; der bestehende Hinweis auf einen Tag Vorlauf bleibt erhalten.
- Google Maps lädt erst nach Klick, Routenlinks und Telefonnummer funktionieren unabhängig davon.
- Mobile Navigation, Schnellzugriff auf Karte und Telefon, dezente Einblendungen und Rücksicht auf reduzierte Bewegung.
- Impressum und Datenschutz mit derselben Anbietergrundlage und erneuertem Seitenrahmen.

## Bearbeiten und bereitstellen

Kein npm, Framework oder Buildserver erforderlich. `index.html`, `html/`, `css/`, `js/`, `img/` und `fonts/` werden direkt vom statischen Host ausgeliefert. Die bestehende `CNAME` für `www.ersans-kebap.de` und `.nojekyll` bleiben unverändert.

Inhalte werden in `build.py` und `data/` gepflegt. `python build.py` erzeugt die sechs Seiten und die Bewertungsdaten erneut. CSS und Interaktionen liegen in `css/styles.css` und `js/app.js`. Diese Quelldateien werden vom Seitengenerator nicht überschrieben.

Die bisherigen Originalbilder sind erhalten. WebP-Dateien unter `img/optimized/` berücksichtigen die EXIF-Drehung. Responsive Varianten mit 480/960 Pixeln und einer größeren Galerieversion werden über `srcset` und `sizes` ausgeliefert. Die Galerie lädt große Dateien erst beim Öffnen. Die Schriftfamilien DM Sans und Instrument Serif sind lokal inklusive OFL-Lizenzen enthalten. Es gibt keine externen Google-Fonts-Abfragen.

## Recherche und Bilder

- [Recherche und Entscheidungen](docs/design-research.md)
- [Bildherkunft und Generierungsprompt](docs/image-source.md)

Das neue Hauptmotiv unter `img/optimized/hero-kebap.webp` ist KI-generiert und als illustrativer Serviervorschlag gekennzeichnet. Personen- und Ladenfotos wurden nicht generativ ersetzt. Gästestimmen stammen aus dem bisherigen Repository und sind keine Live-Google-Abfrage; die frühere Kennzeichnung als „verifiziert“ und veraltende relative Datumsangaben wurden entfernt.

## Prüfungen

```bash
python build.py
python tools/check-site.py
python tools/check-responsive.py
python tools/check-performance-seo.py
node --check js/app.js
node tools/test-functions.cjs
node tools/test-menu.cjs
```

Prüfungen umfassen lokale Links und Anker, Schrift- und Bilddateien, Datenübernahme, Suchbegriffe und Umlaute, Öffnungszeiten inklusive Winterzeit, HTTP-Fehler und die realen Formularzustände mit simulierten Antworten. Kein Test versendet eine echte Kundenanfrage.

Eine visuelle Browserprüfung und ein produktiver E-Mail-Eingangstest waren in dieser Umgebung nicht verfügbar. Die bereits bestehenden Platzhalter für Betreiber-/Register- und Providerangaben in den Rechtstexten müssen weiterhin vom Betreiber vervollständigt werden. Die Überarbeitung ist keine rechtliche Prüfung.

## Lesbarkeit und Speisekarte

Die Schriftgrößen wurden auf deutlich lesbarere Werte angehoben: Fließtexte 16–17 px, Menüpunkte 17–18 px und Preise 18–19 px. Kleine Hilfstexte, Links und Footerinformationen wurden ebenfalls vergrößert und ihre Kontraste verstärkt. Das vorhandene gemeinsame Logo steht nun im dunklen Header. Die Speisekarte verwendet warme Sand-, Karamell- und Espressotöne mit klar getrennten Gerichten und Preisen.

## Kontaktformular auf kleinen Bildschirmen

Kontaktbereich bis 900 px einspaltig; Formular und Senden-Schaltfläche passen sich an die verfügbare Breite an. Ein hervorgehobener Hinweis direkt vor den Feldern nennt mindestens 1 Tag Vorlauf und die erforderliche persönliche Bestätigung. `check-responsive.py` prüft statisch die Reihenfolge der relevanten CSS-Regeln an zehn Bildschirmbreiten; es ersetzt keine gerenderte Browserprüfung.

## Bilder, Ladewege und SEO

`python tools/optimize-assets.py` erzeugt mit Pillow und fontTools/Brotli die WebP-Varianten, ein kleines transparentes Headerlogo, WOFF2-Dateien und das Bildmanifest `data/images.json`. Danach `python build.py` ausführen. Die aufbewahrte Quelldatei `img/hero-kebap-source.webp` dient nur der reproduzierbaren Bildoptimierung und wird nicht in Seiten eingebunden. Alle anderen Originalbilder bleiben ebenfalls erhalten.

Die größten Bildversionen sind zusammen 35,4 % kleiner als zuvor. Das Logo sinkt von 224.122 auf 35.298 Byte; die 960-Pixel-Version des Herobilds hat 83.322 statt 292.420 Byte. Dies sind Dateigrößen, keine gemessenen Ladezeiten oder Lighthouse-Werte. Die vom Browser gewählte Bildgröße hängt von Layout, Displaydichte und Cache ab. Hauptbilder werden priorisiert, weitere Bilder nachgeladen, Schriften lokal im kleineren WOFF2-Format geladen. Die Speisekarten-CSS wird nur auf der Speisekarte eingebunden.

Jede Seite besitzt eine eigene kanonische URL, lokale Seitentitel, Beschreibung, Open-Graph-Metadaten und JSON-LD. Restaurantdaten verwenden vorhandene Kontakt- und Öffnungsdaten; die Speisekarte enthält alle 64 Positionen mit unveränderten Preisen. Es werden keine Bewertungssterne oder erfundenen Geschäftsdaten als Schema ergänzt. `robots.txt` und `sitemap.xml` werden ebenfalls erzeugt. Search-Console-Einreichung, Google-Indexierung und Core Web Vitals sind nicht von dieser Quellcodeprüfung abgedeckt.
