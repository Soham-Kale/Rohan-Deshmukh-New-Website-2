@echo off
title Rohan Deshmukh Website
cd /d "%~dp0"
where node >NUL 2>NUL || (echo Node.js is not installed. Install it from https://nodejs.org and run this again. & pause & exit /b 1)
if not exist .env copy .env.example .env >NUL
echo Checking packages...
call npm install --no-audit --no-fund --loglevel=error
if errorlevel 1 (echo npm install failed & pause & exit /b 1)
echo.
echo Starting the FAST website. After code changes the first start rebuilds it (2-5 minutes).
echo Website:     http://localhost:3000
echo Admin panel: http://localhost:3000/admin   (admin@rohandeshmukh.in / ChangeMe@123)
echo Keep this window open. Close it (or press Ctrl+C) to stop.
echo.
call npm run preview
pause
