# OrienTom — Guida all'orientamento
### Adda Martesana · Bassa Bergamasca · Dalminese · Cremasco

Guida indipendente per la scelta della scuola superiore. **Parla ai ragazzi di 2ª e 3ª media**,
in seconda persona: le poche parti che devono fare materialmente i genitori (SPID per l'iscrizione,
ISEE per la Dote Scuola, abbonamenti dei trasporti) sono segnalate come tali. Copre il ciclo di **iscrizioni per l'a.s. 2027/28** (open day
ottobre–dicembre 2026, iscrizioni gennaio 2027).

Sito pubblicato su **https://edu.privix.org** via GitHub Pages + GitHub Actions.

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

Ultima verifica delle fonti: **9 settembre 2026**.

Due eventi segnalati e **non confermati** dalle fonti: un «Salone dell'Isola Bergamasca» a
Ponte San Pietro (nessuna traccia: per quell'area il riferimento resta la Fiera di Bergamo) e un
«Campus in rete» al Centro Omnicomprensivo di Vimercate (l'evento esiste ma si chiama *Giornata
dell'Orientamento Rete TreVi* e si tiene all'ECFOP di Velasca). Entrambi sono dichiarati nel sito.

### Stato al 9 settembre 2026

Nessuna delle scuole censite aveva ancora pubblicato le date dei propri open day. Sono invece
già confermate le date dei saloni: YOUNG a Erba (12–14 novembre), Festival Orientamenti a
Genova (17–20 novembre), JOB&Orienta a Verona (25–28 novembre). La Fiera dell'Orientamento
della Provincia di Bergamo e il Campus Orienta di Melzo sono marcati come *da confermare*.

---

feel free to contribute or share
