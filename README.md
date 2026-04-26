# OrientoTommy — Guida Orientamento Adda Martesana
Sito pubblicato su **https://edu.privix.org** via GitHub Pages + GitHub Actions.

---

## FILE DA CARICARE SU GITHUB

```
orientommy/
├── index.html                   ← tutta l'app (unico file da servire)
├── CNAME                        ← NON usato da GitHub Actions (vedi nota)
├── .gitignore
├── README.md                    ← questo file
└── .github/
    └── workflows/
        └── pages.yml            ← deploy automatico ad ogni push su main
```

> ⚠️ **NOTA IMPORTANTE (da docs GitHub ufficiali)**
> Quando si usa un workflow GitHub Actions personalizzato per il deploy,
> il file `CNAME` presente nel repository **viene ignorato**.
> Il dominio personalizzato va configurato **esclusivamente** da
> Settings → Pages → Custom domain.
> Fonte: https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/managing-a-custom-domain-for-your-github-pages-site

---

## FASE 1 — Creare il repository GitHub

1. Vai su **https://github.com** e fai login
2. Clicca **"New repository"** (pulsante verde in alto a sinistra)
3. Compila esattamente così:
   - **Repository name**: `orientommy`
   - **Visibility**: `Public` ← obbligatorio per GitHub Pages gratuito
   - **NON** aggiungere README, .gitignore o licenza
4. Clicca **"Create repository"**

---

## FASE 2 — Caricare i file con Git

Apri **PowerShell** (Windows) o **Terminale** (Mac) e lancia questi comandi:

```bash
# 1. Entra nella cartella del progetto
cd "C:\Users\Ale\Documents\Claude\Projects\orientommy"

# 2. Inizializza git
git init

# 3. Aggiungi tutti i file
git add .

# 4. Primo commit
git commit -m "deploy iniziale OrientoTommy"

# 5. Collega al tuo repository
#    ↓ sostituisci TUO_USERNAME con il tuo username GitHub (es. aleprivix)
git remote add origin https://github.com/TUO_USERNAME/orientommy.git

# 6. Imposta branch main e carica
git branch -M main
git push -u origin main
```

### Se Git chiede le credenziali

Non usare la password GitHub — usa un **Personal Access Token**:

1. GitHub → foto profilo → **Settings**
2. Sidebar sinistra in fondo → **Developer settings**
3. **Personal access tokens** → **Tokens (classic)**
4. **Generate new token (classic)**
5. Spunta i permessi: `repo` + `workflow`
6. Copia il token generato e usalo come **password** quando Git lo chiede

---

## FASE 3 — Abilitare GitHub Pages con GitHub Actions

1. Nel repository appena creato, clicca il tab **Settings** (ingranaggio)
2. Sidebar sinistra → sezione "Code and automation" → **Pages**
3. Sotto **"Build and deployment"** → **Source**: seleziona **`GitHub Actions`**
   _(non scegliere "Deploy from a branch")_
4. GitHub rileva automaticamente `.github/workflows/pages.yml`
5. Vai sul tab **Actions** — il primo deploy parte subito. Deve diventare verde ✅

---

## FASE 4 — Impostare il dominio personalizzato su GitHub

> Questo passaggio è obbligatorio. Il file CNAME del repo viene ignorato da GitHub Actions.

1. **Settings → Pages**
2. Trova il campo **"Custom domain"**
3. Scrivi esattamente: `edu.privix.org`
4. Clicca **Save**
5. GitHub avvia una verifica DNS — mostrerà un avviso finché il DNS non è configurato

---

## FASE 5 — Configurare i record DNS su Cloudflare

> `edu.privix.org` è un **sottodominio** → si usa un record **CNAME**.

### Accedi a Cloudflare

1. Vai su **https://dash.cloudflare.com** e fai login
2. Seleziona il dominio **`privix.org`**
3. Click su **DNS** nel menu laterale sinistro
4. Click **"Add record"** (pulsante blu)

### Record da aggiungere

| Campo       | Valore                                        |
|-------------|-----------------------------------------------|
| **Type**    | `CNAME`                                       |
| **Name**    | `edu`                                         |
| **Target**  | `TUO_USERNAME.github.io`                      |
| **TTL**     | `Auto`                                        |
| **Proxy**   | ☁️ **DNS only** (nuvola GRIGIA, NON arancione) |

> ⚠️ **CRITICO — Cloudflare Proxy DEVE essere DISATTIVATO**
> La nuvola deve essere **grigia** (DNS only), non arancione (Proxied).
> Con il proxy arancione attivo, GitHub non riesce a validare il dominio
> e il certificato HTTPS non viene emesso.
> Lascia sempre la nuvola grigia per i domini GitHub Pages.

Esempio con username `aleprivix`:
```
Type:   CNAME
Name:   edu
Target: aleprivix.github.io
TTL:    Auto
Proxy:  DNS only (grigia)
```

Clicca **Save**.

---

## FASE 6 — Attendere la propagazione DNS e attivare HTTPS

### Verifica propagazione DNS

Usa questo strumento online per controllare che il record CNAME si sia propagato:

```
https://www.whatsmydns.net/#CNAME/edu.privix.org
```

Dovresti vedere `TUO_USERNAME.github.io` in verde su tutti i server mondiali.
La propagazione richiede solitamente **5–30 minuti** (al massimo 24h).

### Attivare "Enforce HTTPS"

1. Torna su GitHub → **Settings → Pages**
2. Quando la verifica DNS è completata, appare il checkbox **"Enforce HTTPS"**
3. Spuntalo ✅

Da questo momento il sito risponde su `https://edu.privix.org` con certificato SSL valido.

---

## FASE 7 — Verifica finale

| Cosa controllare | Come |
|---|---|
| Deploy riuscito | GitHub → tab **Actions** → ultimo run verde ✅ |
| DNS propagato | https://www.whatsmydns.net/#CNAME/edu.privix.org |
| Sito raggiungibile | https://edu.privix.org |
| HTTPS attivo | 🔒 nel browser, nessun avviso di sicurezza |

---

## Aggiornare il sito in futuro

Ogni modifica a `index.html` + push su `main` → deploy automatico in ~1 minuto:

```bash
git add index.html
git commit -m "aggiornamento contenuti"
git push
```

---

## Risoluzione problemi comuni

**Il sito mostra "404 Not Found"**
→ Controlla che il workflow in Actions sia verde. Se è rosso, clicca sul run fallito per vedere l'errore.

**"Domain is improperly configured" su GitHub Pages**
→ Il record DNS non è ancora propagato, oppure la nuvola Cloudflare è arancione. Rendila grigia.

**HTTPS non si attiva**
→ Aspetta la propagazione DNS completa, poi vai Settings → Pages e spunta "Enforce HTTPS".

**Il push fallisce con errore autenticazione**
→ Usa il Personal Access Token come password (non la password GitHub).

---

## Fonti ufficiali

- Docs GitHub custom domain: https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/managing-a-custom-domain-for-your-github-pages-site
- Troubleshooting: https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/troubleshooting-custom-domains-and-github-pages
- Iscrizioni scolastiche: https://unica.istruzione.gov.it
