# Ersan’s Kebap: Recherche und Gestaltungsentscheidungen

Stand: 15.10.2026. Ziel ist eine hochwertigere, eigenständige Restaurant-Website mit direktem Zugang zu Speisekarte, Kontakt und Vorbestellung. Grundlage waren der bestehende Quellcode, die vorhandenen Bilder und öffentlich zugängliche Primärquellen. Die Beurteilung der Ausgangsseite erfolgte über Inhalte, CSS und Bildsichtung; eine gerenderte Browserprüfung war in dieser Umgebung nicht verfügbar.

## Was den bisherigen Auftritt schwächt

- Sehr große Radien und runde Schaltflächen wiederholen sich nahezu überall. Zusammen mit großen Schatten, Farbverläufen, weißen Boxen und schwebenden Karten konkurrieren zu viele Oberflächen um Aufmerksamkeit.
- Das gemeinsame Logo von Stern Sports Bar und Ersan’s beansprucht im Header viel Raum. Die eigentlichen Gästeaufgaben werden dadurch nachrangig. Der gemeinsame Markenbezug bleibt im neuen Footer erhalten; im Kopf steht eine kompakte typografische Wortmarke für Ersan’s.
- Reale Fotos haben unterschiedliche Ausrichtungen und sehr große Ausgangsdateien. Einige Bilder sind erst durch ihre EXIF-Drehung korrekt lesbar. Die neuen WebP-Dateien berücksichtigen diese Orientierung und reduzieren die übertragenen Daten.
- In der Speisekarte wurden Fotos teils für unpassende Gerichte wiederverwendet, etwa Currywurst für Pommes und Pizza für Calzone. Statt jedem Abschnitt ein beliebiges Bild zu geben, setzen wir wenige, bewusst platzierte Motive ein.
- Die bisherigen Bewertungen waren als „verifiziert“ markiert und enthielten relative Zeitangaben ohne Aktualisierung. Die vorhandenen Stimmen bleiben erhalten, ohne dieses nicht belegte Gütesiegel oder veraltende Zeitangaben.
- Das bestehende Formular hatte bereits einen Formspree-Endpunkt, sperrte den Button aber sofort nach dem Submit. Eine fehlgeschlagene Übermittlung durfte nicht als erfolgreiche Bestellung erscheinen.

## Untersuchte Referenzen

### Keladam’s Kebab und NOVAUX

[Veröffentlichte Restaurantseite](https://www.keladams-kebab.de/) · [Case Study des verantwortlichen Studios](https://webdesign-hamburg.de/case-study-keladams-kebab.html)

Die Case Study verbindet drei Aufgaben: Produkt zeigen, Persönlichkeit vermitteln und Besuchsinformationen erreichbar halten. Ihre dokumentierte Struktur führt über Produkt und Geschichte zu Standort und Kontakt. Für Ersan’s übernehmen wir dieses Strukturprinzip: appetitlicher Einstieg, echtes Gesicht des Ladens, erreichbare Speisekarte und konkrete Besuchsinformationen. Markenfarben, Texte und Komposition werden eigenständig entwickelt.

### Kebab’ry 100

[Offizielle Website](https://www.kebabry.de/)

Das Angebot wird in verständliche Produktgruppen gegliedert und mit dem Betrieb und seiner Arbeitsweise verbunden. Für Ersan’s folgt daraus eine klare Trennung zwischen appetitlichem Einstieg und vollständiger Speisekarte. Produktversprechen, Fleischsorten oder Herstellungsverfahren dieser Marke werden ausdrücklich nicht auf Ersan’s übertragen.

### Kebap with Attitude

[Offizielle Website](https://www.kebapyourlife.de/)

Die offizielle Darstellung zeigt, wie eine Döner-Marke eine eigenständige Identität mit Essen und Atmosphäre aufbauen kann. Ersan’s erhält bewusst einen ruhigeren, lokalen Charakter. Bildsprache und Ton sollen zu einem persönlichen Imbiss passen und keinen größeren Restaurantbetrieb vortäuschen.

## Konkrete Ableitungen für Ersan’s

1. **Eine klare visuelle Hierarchie:** Elfenbein als Grundfläche, tiefes Petrol für Marke und Handlungsflächen, reduzierte Konturen. Keine pauschalen Kartenschatten oder dekorativen Pillen.
2. **Editoriale Typografie:** Instrument Serif für große Aussagen und DM Sans für Informationen. Beide Familien liegen lokal mit ihrer SIL-Open-Font-Lizenz bei.
3. **Bilder mit unterschiedlichen Aufgaben:** Das neue generierte Food-Motiv dient als illustrativer Einstieg. Originalfotos zeigen Ersan, die offene Küche und die Geschichte des Ladens. Bildhinweise unterscheiden diese Rollen.
4. **Schneller Weg zur Karte:** Auf dem Desktop sichtbare Navigation und auf Mobilgeräten zusätzliche Zugänge zu Speisekarte und Anruf. Die vollständige Karte besitzt Suche und Kategorien, ist ohne JavaScript weiterhin lesbar und enthält alle 64 bisherigen Einträge samt Preisen und Kennzeichnungen.
5. **Interaktion ohne Ablenkung:** Gerichte lassen sich per Klick auswählen; die zugehörige Bildfläche und der Menülink wechseln. Bewertungen werden manuell weitergeschaltet. Die echten Bilder der Geschichte öffnen sich in einer Tastatur-bedienbaren Galerie.
6. **Konkrete Besuchsinformationen:** Öffnungszeiten, Adresse und Telefon sind eigenständige Informationselemente. Der Status verwendet ausdrücklich die Zeitzone Europe/Berlin. Die interaktive Karte lädt erst nach Klick.
7. **Verlässliche Formularrückmeldung:** Der vorhandene Formspree-Endpunkt bleibt erhalten. Erfolg wird nur nach erfolgreicher Serverantwort angezeigt. Bei Fehlern bleiben Eingaben erhalten und der Button wird wieder freigegeben. Der Hinweis auf mindestens einen Tag Vorlauf und die nötige persönliche Bestätigung bleibt bestehen.

## UX- und technische Quellen

- [Nielsen Norman Group: Menu-Design Checklist](https://www.nngroup.com/articles/menu-design/): sichtbare Navigation auf großen Bildschirmen, vertraute Bezeichnungen und klare aktuelle Position. Daraus folgen unsere sichtbare Desktop-Navigation, aktive Seitenmarkierung und direkt verständliche Linktexte.
- [W3C: prefers-reduced-motion](https://www.w3.org/WAI/WCAG22/Techniques/css/C39): nicht notwendige Bewegung lässt sich über die Systemeinstellung reduzieren. CSS und JavaScript berücksichtigen dies. Es gibt keine automatisch laufenden Bewertungs- oder Bildkarussells.
- [Google web.dev: High-performance CSS animations](https://web.dev/articles/animations-guide): bevorzugt Opazität und Transformation animieren. Einblendungen und Bildwechsel verwenden diese Eigenschaften; das normale Scrollverhalten wird nicht ersetzt.
- [Formspree: AJAX](https://formspree.io/blog/formspree-ajax/): asynchrone Formulare nutzen JSON-Antworten und müssen den Antwortstatus auswerten. Unsere Implementierung benötigt dafür kein zusätzliches Browserpaket.

## Grenzen der Prüfung

Links, lokale Assets, Datenübernahme, Suchlogik, Öffnungszeiten, JavaScript und Formularzustände werden automatisiert geprüft. Formulartests verwenden simulierte Antworten und senden keine echten Anfragen. Eine visuelle Prüfung in einem echten Browser sowie der produktive E-Mail-Eingang konnten hier nicht getestet werden. Die bereits vorhandenen Platzhalter im Impressum und in den Providerangaben sind weiterhin vom Betreiber zu vervollständigen; es wurde keine rechtliche Prüfung durchgeführt.

## Nachjustierung nach Kundenfeedback

Der Header zeigt jetzt das vorhandene gemeinsame Logo auf dunklem Grund. Die zuvor sehr kleinen Beschriftungen wurden deutlich angehoben. Der Fokus liegt auf 16–17 px für Fließtexte und 17–19 px für Gerichte und Preise. Die Speisekarte erhielt eine durchgehende warme Sand- und Espresso-Farbwelt. Diese konkreten Korrekturen ersetzen die anfängliche Entscheidung für eine rein typografische Header-Wortmarke und kleine redaktionelle Beschriftungen.

## Speisekarte und Ladeoptimierung · 15.10.2026

Verglichen wurden die Speisekarten von [Kebab’ry](https://kebabry.de/speisekarte.html), [Hans Kebab](https://www.hanskebab.de/) und [Kebap with Attitude](https://www.kebapyourlife.de/de/restaurant-menu). Übernommen werden Gestaltungsideen wie deutlich getrennte Produktnamen/Beschreibungen/Preise, gut erreichbare Kategorien und gezielte Food-Fotografie. Aussagen, Produkttexte und Preislogik anderer Betriebe werden nicht übertragen.

Die neue Karte setzt auf warme Papierfarben, dunkles Grün und geröstete Brauntöne. Ein Food-Hero, drei direkte Einstiege, horizontale Kategorien und kontinuierliche Kapitel ersetzen die vielen beigefarbenen Boxen und die schwere Seitenleiste. Namen sind 18 px, Beschreibungen 16 px und Preise 19–20 px. Auf kleinen Bildschirmen werden die Kapitel einspaltig; die Kategorien sind horizontal bedienbar. Alle 64 Positionen, Preise und Zusatzstoffcodes bleiben aus `data/menu.json` erhalten.

Für die Umsetzung dienen die Primärquellen [responsive Bilder](https://developer.mozilla.org/en-US/docs/Web/HTML/Guides/Responsive_images), [Bildkompression](https://web.dev/learn/images/automating), [lokale Unternehmensdaten](https://developers.google.com/search/docs/appearance/structured-data/local-business) und [kanonische URLs](https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls). Bildgrößen, Markup, CSS-Kaskade und Formularverhalten sind lokal prüfbar. Eine gerenderte Browseransicht, Rich Results Test, Google-Indexierung und reale Netzwerkladezeit wurden in dieser Umgebung nicht geprüft.
