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

Die bisherigen Originalbilder sind erhalten. Zusätzlich genutzte WebP-Dateien unter `img/optimized/` berücksichtigen deren EXIF-Drehung und reduzieren den Download. Die Schriftfamilien DM Sans und Instrument Serif sind lokal inklusive OFL-Lizenzen enthalten. Es gibt keine externen Google-Fonts-Abfragen.

## Recherche und Bilder

- [Recherche und Entscheidungen](docs/design-research.md)
- [Bildherkunft und Generierungsprompt](docs/image-source.md)

Das neue Hauptmotiv unter `img/optimized/hero-kebap.webp` ist KI-generiert und als illustrativer Serviervorschlag gekennzeichnet. Personen- und Ladenfotos wurden nicht generativ ersetzt. Gästestimmen stammen aus dem bisherigen Repository und sind keine Live-Google-Abfrage; die frühere Kennzeichnung als „verifiziert“ und veraltende relative Datumsangaben wurden entfernt.

## Prüfungen

```bash
python build.py
python tools/check-site.py
python tools/check-responsive.py
node --check js/app.js
node tools/test-functions.cjs
```

Prüfungen umfassen lokale Links und Anker, Schrift- und Bilddateien, Datenübernahme, Suchbegriffe und Umlaute, Öffnungszeiten inklusive Winterzeit, HTTP-Fehler und die realen Formularzustände mit simulierten Antworten. Kein Test versendet eine echte Kundenanfrage.

Eine visuelle Browserprüfung und ein produktiver E-Mail-Eingangstest waren in dieser Umgebung nicht verfügbar. Die bereits bestehenden Platzhalter für Betreiber-/Register- und Providerangaben in den Rechtstexten müssen weiterhin vom Betreiber vervollständigt werden. Die Überarbeitung ist keine rechtliche Prüfung.

## Lesbarkeit und Speisekarte

Die Schriftgrößen wurden auf deutlich lesbarere Werte angehoben: Fließtexte 16–17 px, Menüpunkte 17–18 px und Preise 18–19 px. Kleine Hilfstexte, Links und Footerinformationen wurden ebenfalls vergrößert und ihre Kontraste verstärkt. Das vorhandene gemeinsame Logo steht nun im dunklen Header. Die Speisekarte verwendet warme Sand-, Karamell- und Espressotöne mit klar getrennten Gerichten und Preisen.

## Kontaktformular auf kleinen Bildschirmen

Kontaktbereich bis 900 px einspaltig; Formular und Senden-Schaltfläche passen sich an die verfügbare Breite an. Ein hervorgehobener Hinweis direkt vor den Feldern nennt mindestens 1 Tag Vorlauf und die erforderliche persönliche Bestätigung. `check-responsive.py` prüft statisch die Reihenfolge der relevanten CSS-Regeln an zehn Bildschirmbreiten; es ersetzt keine gerenderte Browserprüfung.
