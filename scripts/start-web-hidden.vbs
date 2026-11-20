' GradieKAn: menyalakan server web (http://localhost:5173) tanpa jendela dan tanpa VS Code.
' Dipasang ke folder Startup Windows oleh scripts/install-autostart.ps1 agar berjalan setiap login.
' Log tersimpan di %TEMP%\gradiekan-web.log. Untuk berhenti: tutup proses "node.exe" di Task Manager.
Option Explicit
Dim sh, fso, root
Set sh = CreateObject("WScript.Shell")
Set fso = CreateObject("Scripting.FileSystemObject")
root = fso.GetParentFolderName(fso.GetParentFolderName(WScript.ScriptFullName))
sh.CurrentDirectory = root
' Hasil perintah: cmd /c "set "PATH=C:\Program Files\nodejs;%PATH%" && npm run dev:web > "%TEMP%\gradiekan-web.log" 2>&1"
sh.Run "cmd /c ""set ""PATH=C:\Program Files\nodejs;%PATH%"" && npm run dev:web > ""%TEMP%\gradiekan-web.log"" 2>&1""", 0, False
' F-34 Tanya AI: server Python (http://localhost:8000) untuk meneruskan pertanyaan ke Claude. Log: %TEMP%\gradiekan-api.log
sh.Run "cmd /c ""set ""PATH=C:\Program Files\nodejs;%PATH%"" && npm run dev:api > ""%TEMP%\gradiekan-api.log"" 2>&1""", 0, False
