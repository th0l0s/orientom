# OrienTom — Guida all'orientamento
### Adda Martesana · Bassa Bergamasca · Dalminese · Cremasco

Guida indipendente per la scelta della scuola superiore. **Parla ai ragazzi di 2ª e 3ª media**,
in seconda persona: le poche parti che devono fare materialmente i genitori (SPID per l'iscrizione,
ISEE per la Dote Scuola, abbonamenti dei trasporti) sono segnalate come tali. Copre il ciclo di **iscrizioni per l'a.s. 2027/28** (open day
ottobre–dicembre 2026, iscrizioni gennaio 2027).

Sito pubblicato su **https://edu.privix.org** via GitHub Pages + GitHub Actions.

Progetto gemello: **[move.privix.org](https://move.privix.org)** (repo `move`) — mappa della rete
bus del quadrangolo Fara–Vaprio–Treviglio–Cassano, matrice delle tratte e coincidenze con i treni.
Stessa area, stesso criterio editoriale, stessa catena di pubblicazione.

## Cosa contiene

- **24 istituti statali** in 13 comuni (Melzo, Cassano d'Adda, Cernusco s/N, Gorgonzola,
  Pioltello, Cologno Monzese, Inzago, Trezzo s/Adda, Treviglio, Caravaggio, Romano di L.,
  **Dalmine**, **Crema**), con indirizzi, sedi, contatti e programmi internazionali verificati
- **2 paritarie con scheda dedicata**, scelte perché offrono indirizzi che nello statale
  della zona non esistono: Licei Sant'Agostino (Gorgonzola — linguistico internazionale e
  scientifico sportivo) e Centro Salesiano Don Bosco (Treviglio — liceo, ITT logistica, CNOS-FAP)
- **CFP / IeFP con sede reale in zona** (AFMG Gorgonzola, ENAIP Melzo, Romano e Dalmine,
  ABF, ENFAPI e CNOS-FAP a Treviglio, CR.FORMA a Crema)
- **Orientamento e counseling**: docente tutor/orientatore ed E-Portfolio su Unica, i tre
  portali provinciali (Atlante delle Scelte per Bergamo, ITER per Milano, Dopo la Terza Media
  per Cremona), Informagiovani della Martesana e di Milano, ri-orientamento nei CFP
- **Calendario di saloni ed eventi** dell'autunno 2026: tre saloni locali (Giornata Rete TreVi
  a Vimercate, Campus Orienta a Melzo, **Treviglio Orienta** a TreviglioFiera), la Fiera
  dell'Orientamento della Provincia di Bergamo e i tre saloni nazionali
- **Due filtri combinabili** sulle schede: per tipo/zona (chip) e **per indirizzo di studio**
  (menu con 25 voci, dal liceo classico all'odontotecnico alla IeFP)
- **«Dove escono le date per prime»**: i canali reali da cui arrivano gli open day —
  la scuola media, il comitato genitori, Comune ed ente fiera, le reti fra scuole
- **«La tua lista»**: nove mosse da spuntare da qui a gennaio, con barra di avanzamento.
  Lo stato resta in `localStorage` sul dispositivo di chi legge, dentro try/catch: la pagina
  funziona identica se lo storage è bloccato
- **Cronologia degli aggiornamenti** nel footer, apribile
- **Indirizzi rari** assenti dal territorio — artistico, musicale, coreutico, sportivo —
  con le alternative più vicine
- **Procedura di iscrizione**: piattaforma Unica, regola "una scuola + due riserve",
  criteri di precedenza, consiglio di orientamento, cosa fare se nessuna scuola accetta
- **Costi reali**: contributo volontario, tasse erariali, tetti di spesa dei libri,
  Dote Scuola di Regione Lombardia (Materiale didattico, Buono Scuola, Merito)
- **Trasporti**: tariffe STIBM e ATB per studenti, agevolazioni "Io Viaggio in Famiglia",
  e la differenza di costo fra il lato milanese e quello bergamasco
- **Orari dei bus** fra Fara Gera d'Adda, Canonica, Vaprio, Treviglio, Cassano e la M2 di
  Gessate: linee B812 (ex F), T10, Z309, Z311 e z405, con tabelle complete e un **pianificatore**
  che calcola le prossime corse e le coincidenze (un cambio, più la coda in metropolitana per
  Cernusco). Dati in `BUS_TRIPS`, in fondo allo script: per aggiornarli bastano `corse` e `off`
- **Dopo il diploma**: ITS Academy raggiungibili, filiera 4+2, passerelle IeFP
- **Calendario** delle scadenze da settembre 2026 a gennaio 2028

## Fuori perimetro, di proposito

Sono esclusi i **percorsi per adulti** (corsi serali, CPIA, ASA-OSS, IFTS, «Riprendo gli studi»)
e **tutto ciò che riguarda l'estate** (centri estivi, preparazione dei libri a luglio-agosto):
questa guida serve a scegliere la prima superiore, non a rientrare a studiare da grandi né a
riempire le vacanze. Non reintrodurli senza motivo.

## A chi parla

Al ragazzo o alla ragazza di **12-13 anni**, in seconda o terza media. Si dà del tu, le frasi
sono corte, il gergo è spiegato dove compare. Quello che devono fare i genitori (SPID, ISEE,
abbonamenti) sta in blocchi separati e dichiarati — nel caso degli avvisi economici, dentro un
`<details>` intitolato «Da far leggere ai tuoi».

## Criterio editoriale

Ogni dato è verificato su fonte ufficiale (siti `.edu.it` delle scuole, anagrafe MIM,
bandi di Regione Lombardia, tariffari degli operatori di trasporto) e riporta il link.
Ciò che non è stato possibile verificare è marcato esplicitamente come *da verificare*
invece di essere omesso o inventato.

Le previsioni sul 2027/28 (date della circolare iscrizioni, apertura dei bandi Dote Scuola,
tetti di spesa dei libri) sono marcate come tali: al momento della stesura non erano ancora
state pubblicate.

## Struttura tecnica

File singolo `index.html`, senza dipendenze esterne tranne Google Fonts.
CSS e JS inline, nessun framework, nessun tracker, nessuna pubblicità.
CSP restrittiva via meta tag (`_headers` per gli header lato server, se si passa a Cloudflare o Netlify).

Verifiche eseguite: nessun errore JS in console, nessuno scroll orizzontale a 390px,
tutti i filtri e il quiz funzionanti, link esterni controllati.

## Manutenzione

Le voci che invecchiano più in fretta, in ordine:

1. **Date degli open day** — le scuole le pubblicano da fine settembre. Da aggiungere allora.
2. **Circolare iscrizioni** — esce fra fine novembre e metà dicembre, su `mim.gov.it`.
3. **Bandi Dote Scuola** — Merito a settembre, Buono Scuola a novembre, Materiale didattico a marzo.
4. **Tetti di spesa dei libri** — decreto ministeriale a marzo.
5. **Tariffe di trasporto** — adeguamenti tipicamente a settembre.
6. **Orari dei bus** — i più volatili di tutti. SAI e NET cambiano libretto a metà settembre
   (orario scolastico) e a giugno (estivo). Quelli in pagina per la B812 sono le corse base in vigore
   dal 3 agosto 2026 (dal 14 settembre si aggiungono le corse scolastiche), invernali per Z309
   e Z311. I dati vanno rifatti sui PDF dei gestori a ogni cambio di libretto.
7. **Canali video** — nel footer di ogni scheda c'è il link YouTube/Vimeo della scuola. Senza
   etichetta = linkato dal sito ufficiale; `non verificato` = trovato ma non linkato dal sito.

Ultima verifica delle fonti: **3 ottobre 2026**.

Due eventi segnalati e **non confermati** dalle fonti: un «Salone dell'Isola Bergamasca» a
Ponte San Pietro (nessuna traccia: per quell'area il riferimento resta la Fiera di Bergamo) e un
«Campus in rete» al Centro Omnicomprensivo di Vimercate (l'evento esiste ma si chiama *Giornata
dell'Orientamento Rete TreVi* e si tiene all'ECFOP di Velasca). Entrambi sono dichiarati nel sito.

### Stato al 3 ottobre 2026

Regola: **una data non confermata alla fonte non si scrive**. Occhio alle pagine «Open day
a.s. 2026/27»: parlano dell'autunno 2025 (controllare sempre il giorno della settimana).

Open day pubblicati: Giordano Bruno (7 e 28 novembre), Nizzola (28 novembre, 12 dicembre,
16 gennaio), Sant'Agostino (24 ottobre, 14 novembre, 12 dicembre), Don Bosco (14 novembre,
12 dicembre, 16 gennaio). Saloni: Campus Orienta Melzo e Rete TreVi Velasca il 17 ottobre,
Treviglio Orienta il 24–25 ottobre, YOUNG a Erba il 12–14 novembre, Festival Orientamenti a
Genova il 17–20 novembre, JOB&Orienta a Verona il 25–28 novembre, Fiera dell'Orientamento di
Bergamo il 27–28 novembre. Tutte le altre scuole non avevano ancora date nuove.

La sezione di apertura «Tre strade, i prossimi appuntamenti» (`#eventi3`) raccoglie gli eventi
per liceo scientifico, informatica ed economia AFM: ogni evento è un `.fx-ev` con `data-date`
(ISO) e `data-path` (`sci`, `info`, `afm`).

---

feel free to contribute or share
