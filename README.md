# OrienTom

Guida essenziale alla scelta della scuola dopo la terza media.
Martesana, Bassa Bergamasca, Dalmine e Crema.

Pubblicata su **https://edu.privix.org/** via GitHub Pages e GitHub Actions.

## Cosa contiene

- 24 istituti statali, 2 paritarie e 8 centri CFP, ognuno con il proprio link ufficiale.
- Nome, comune, tipi di percorso e indirizzi principali; gli altri indirizzi si aprono su richiesta.
- Ricerca per nome, comune o materia, combinabile con tipo, indirizzo e zona.
- Sei schede alla volta; il pulsante «Mostra altre scuole» carica le successive.
- Confronto facoltativo di tre scuole, con appunti privati su viaggio e impressioni.
- Quattro percorsi spiegati in breve, quiz facoltativo e tre domande da fare agli open day.
- Un blocco richiudibile con link per iscrizione, Dote Scuola e trasporti.

L'edizione essenziale elimina approfondimenti ripetuti, elenchi di sigle, classifiche,
cronologie, prezzi, previsioni di scadenze e tabelle di orari. Per corsi, sedi,
prenotazioni e date degli open day si rimanda direttamente all'istituto.
Il progetto gemello **https://move.privix.org/** raccoglie i trasporti della zona.

## Criterio editoriale

Si parla direttamente a chi fa terza media: frasi brevi, informazioni concrete.
Le pratiche da svolgere con un genitore stanno in un blocco separato.
L'elenco e gli indirizzi derivano dalle fonti raccolte a settembre–ottobre 2026.
Il sito dell'istituto resta la fonte da controllare per l'offerta e le date correnti.

Il quiz usa regole semplici basate su interessi e attività preferite. Suggerisce tre
piste: non è un test psicologico validato e non misura capacità o rendimento.

## Struttura

Sito statico, senza framework o build:

- `index.html`: contenuti, indirizzi, collegamenti ufficiali e interazioni di base.
- `assets/experience.css`: grafica e layout responsive.
- `assets/experience.js`: ricerca, filtri, paginazione, confronto e quiz.
- `assets/icon.svg`: icona.

Google Fonts è l'unica dipendenza esterna. Nessun tracker o pubblicità.
La Content Security Policy è dichiarata nel meta tag di `index.html`.

Le coppie tipo/indirizzo dei filtri sono ricavate dalle etichette `.prog-tag` con
`schoolCourses`: quando un istituto offre più famiglie di percorsi, un filtro
«Liceo + Informatica» non deve mostrare il suo corso tecnico. Gli indirizzi più
rilevanti per il filtro attivo compaiono per primi nelle schede.

Le scelte e gli appunti si salvano in `localStorage` con la chiave
`orientom.choices.v1`. Se il browser blocca lo storage funzionano in memoria.
Nessun dato viene inviato. Le vecchie preferite che riguardano istituti ancora
presenti mantengono gli stessi identificativi.

## Anteprima

`python -m http.server 4173 --bind 127.0.0.1`

Aprire `http://127.0.0.1:4173/`. La Action esistente pubblica la cartella del
progetto, inclusi gli asset, a ogni push su `main`.
