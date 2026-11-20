# GradieKAn: pasang / lepas server web otomatis saat login Windows (tanpa hak admin).
#   Pasang : powershell -ExecutionPolicy Bypass -File scripts\install-autostart.ps1
#   Lepas  : powershell -ExecutionPolicy Bypass -File scripts\install-autostart.ps1 -Remove
param([switch]$Remove)

$startup = [Environment]::GetFolderPath('Startup')
$target = Join-Path $startup 'GradieKAn-web.vbs'
$source = Join-Path $PSScriptRoot 'start-web-hidden.vbs'

if ($Remove) {
  if (Test-Path $target) { Remove-Item $target -Confirm:$false; "Dilepas: $target" } else { "Tidak terpasang." }
  return
}

# Salin isi skrip dengan jalur proyek yang tetap (file di folder Startup tidak berada di dalam proyek).
$root = Split-Path $PSScriptRoot -Parent
$body = (Get-Content $source -Raw) -replace 'root = fso\.GetParentFolderName\(fso\.GetParentFolderName\(WScript\.ScriptFullName\)\)', "root = `"$root`""
Set-Content -Path $target -Value $body -Encoding ASCII
"Terpasang: $target"
"Server akan menyala otomatis setiap login. Alamat: http://localhost:5173"
