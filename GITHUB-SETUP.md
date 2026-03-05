# ArboMatcher op GitHub zetten

Stappen om versiebeheer in te richten en het project naar GitHub te uploaden.

---

## Stap 1: Git installeren (als dat nog niet is gedaan)

1. Download **Git voor Windows**: https://git-scm.com/download/win  
2. Installeer met de standaardopties (optie “Git from the command line” aan laten staan).  
3. Sluit Cursor/terminal en open opnieuw, zodat `git` in het PATH staat.

Controle in een nieuwe terminal:

```powershell
git --version
```

---

## Stap 2: Repository lokaal initialiseren

In de projectmap (waar `package.json` staat):

```powershell
cd c:\Temp\ArboMatcher

git init
git branch -M main
git add .
git status
```

Controleer met `git status` of alleen de bedoelde bestanden worden toegevoegd (geen `node_modules`, geen `.env`).

Eerste commit:

```powershell
git commit -m "Initial commit: ArboMatcher – React/Vite/Supabase platform"
```

---

## Stap 3: Repository op GitHub aanmaken

1. Ga naar **https://github.com/new**  
2. **Repository name:** bijvoorbeeld `ArboMatcher` (of `arbomatcher`)  
3. **Description (optioneel):** bv. "Platform voor bedrijfsartsen en arbo-professionals"  
4. Kies **Private** of **Public**  
5. **Niet** “Add a README” of “Add .gitignore” aanvinken (die bestaan al lokaal)  
6. Klik op **Create repository**

---

## Stap 4: Lokaal project aan GitHub koppelen en pushen

GitHub toont na het aanmaken iets als:

```text
…or push an existing repository from the command line
```

Gebruik de **eigen GitHub-gebruikersnaam** en **repo-naam** in onderstaande commando’s.

```powershell
cd c:\Temp\ArboMatcher

git remote add origin https://github.com/JOUW-GEBRUIKERSNAAM/ArboMatcher.git
git push -u origin main
```

- Vervang `JOUW-GEBRUIKERSNAAM` door je GitHub-username.  
- Als je repo een andere naam heeft dan `ArboMatcher`, pas dan ook de repo-naam in de URL aan.

Bij de eerste push wordt om inloggen gevraagd (browser of token).  
Daarna staat je project op GitHub.

---

## Handige git-commando’s daarna

| Actie              | Commando                          |
|--------------------|-----------------------------------|
| Status bekijken    | `git status`                      |
| Wijzigingen stagen | `git add .` of `git add bestand`  |
| Committen          | `git commit -m "Korte beschrijving"` |
| Pushen             | `git push`                        |
| Nieuwste wijzigingen ophalen | `git pull`                |

---

## Samenvatting

1. Git installeren en terminal herstarten.  
2. In projectmap: `git init`, `git add .`, `git commit -m "Initial commit: ..."`.  
3. Op GitHub een **lege** nieuwe repo aanmaken (geen README/.gitignore).  
4. `git remote add origin https://github.com/JOUW-USER/REPO-NAAM.git` en `git push -u origin main`.

Daarna is versiebeheer actief en staat de code netjes op GitHub.
