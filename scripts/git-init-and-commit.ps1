# ArboMatcher - Eerste git-setup (draai vanuit projectroot)
# Gebruik: .\scripts\git-init-and-commit.ps1

$ErrorActionPreference = "Stop"
$projectRoot = Split-Path -Parent $PSScriptRoot
Set-Location $projectRoot

if (-not (Get-Command git -ErrorAction SilentlyContinue)) {
    Write-Host "Git is niet gevonden. Installeer Git: https://git-scm.com/download/win" -ForegroundColor Red
    exit 1
}

if (Test-Path ".git") {
    Write-Host "Git is al geïnitialiseerd in deze map." -ForegroundColor Yellow
    git status
    exit 0
}

Write-Host "Git initialiseren..." -ForegroundColor Cyan
git init
git branch -M main

Write-Host "Bestanden toevoegen (volgens .gitignore)..." -ForegroundColor Cyan
git add .
git status

Write-Host ""
Write-Host "Eerste commit aanmaken..." -ForegroundColor Cyan
git commit -m "Initial commit: ArboMatcher – React/Vite/Supabase platform"

Write-Host ""
Write-Host "Klaar. Volgende stappen:" -ForegroundColor Green
Write-Host "1. Ga naar https://github.com/new en maak een nieuwe repository (zonder README/.gitignore)."
Write-Host "2. Voer daarna uit (vervang JOUW-USER en REPO-NAAM):"
Write-Host "   git remote add origin https://github.com/JOUW-USER/REPO-NAAM.git"
Write-Host "   git push -u origin main"
Write-Host ""
Write-Host "Zie GITHUB-SETUP.md voor de volledige uitleg."
