# ArboMatcher – koppel aan GitHub en push (eenmalig)
# Vervang JOUW-GEBRUIKERSNAAM door je GitHub-username, daarna uitvoeren:
#   .\scripts\push-to-github.ps1

param(
    [Parameter(Mandatory=$true)]
    [string]$GitHubUsername
)

$ErrorActionPreference = "Stop"
$projectRoot = Split-Path -Parent $PSScriptRoot
Set-Location $projectRoot

$repoUrl = "https://github.com/$GitHubUsername/ArboMatcher.git"
Write-Host "Remote toevoegen: $repoUrl" -ForegroundColor Cyan
git remote add origin $repoUrl 2>$null
if ($LASTEXITCODE -ne 0) {
    git remote set-url origin $repoUrl
}
Write-Host "Pushen naar main..." -ForegroundColor Cyan
git push -u origin main
Write-Host "Klaar. Repo: $repoUrl" -ForegroundColor Green
