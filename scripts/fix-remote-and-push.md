# Remote corrigeren en pushen

De remote URL staat nog op de placeholder. Voer in PowerShell uit (vervang **JOUW-ECHTE-USERNAME** door je echte GitHub-username):

```powershell
cd c:\Temp\ArboMatcher
git remote set-url origin https://github.com/JOUW-ECHTE-USERNAME/ArboMatcher.git
git push -u origin main
```

Voorbeeld: als je GitHub-username `abdifatah` is:
```powershell
git remote set-url origin https://github.com/abdifatah/ArboMatcher.git
git push -u origin main
```

Daarna opent Git eventueel je browser voor inloggen; daarna zou de push moeten slagen.
