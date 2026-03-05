# Zoekt Node.js en koppelt het project aan Supabase (ook als npm niet in PATH staat)
$ErrorActionPreference = "Stop"
$projectRoot = Split-Path -Parent $PSScriptRoot
if (-not (Test-Path (Join-Path $projectRoot "package.json"))) {
    $projectRoot = Get-Location
}
Set-Location $projectRoot

$nodeExe = $null
$paths = @(
    "C:\Program Files\nodejs\node.exe",
    "C:\Program Files (x86)\nodejs\node.exe",
    "$env:APPDATA\nvm\current\node.exe",
    "$env:LOCALAPPDATA\Programs\node\node.exe"
)
foreach ($p in $paths) {
    if ($p -and (Test-Path $p)) {
        $nodeExe = $p
        break
    }
}
if (-not $nodeExe) {
    $nodeExe = (Get-Command node -ErrorAction SilentlyContinue).Source
}
if (-not $nodeExe) {
    Write-Host "Node.js niet gevonden."
    exit 1
}

$nodeDir = (Get-Item $nodeExe).DirectoryName
$env:Path = "$nodeDir;$env:Path"

$supabaseCmd = Join-Path $projectRoot "node_modules\.bin\supabase.cmd"
if (-not (Test-Path $supabaseCmd)) {
    Write-Host "Supabase CLI niet gevonden."
    exit 1
}

Write-Host "Project koppelen aan Supabase..."
& $supabaseCmd link --project-ref apizxgqpdledjutgitpw
