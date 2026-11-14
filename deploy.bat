@echo off
set "PATH=C:\Users\VSA\AppData\Local\Microsoft\WinGet\Packages\OpenJS.NodeJS.LTS_Microsoft.Winget.Source_8wekyb3d8bbwe\node-v24.20.0-win-x64;%PATH%"
cd /d "c:\Users\VSA\OneDrive\Documents\shaheel\jassim"
echo ==============================================
echo   Deploying Jassim Wedding Invitation to Firebase
echo ==============================================
echo.
echo Step 1: Building project...
call npm run build
echo.
echo Step 2: Firebase Login...
call npx firebase-tools login
echo.
echo Step 3: Deploying hosting to jassim-mrg...
call npx firebase-tools deploy --only hosting --project jassim-mrg
echo.
echo ==============================================
echo   Deployment Finished!
echo ==============================================
pause
