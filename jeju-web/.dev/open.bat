@echo off
set /a N=0
:check
set /a N+=1
if %N% gtr 25 exit /b
ping -n 2 127.0.0.1 >nul
netstat -ano 2>nul | findstr ":8080 " | findstr "LISTENING" >nul 2>&1
if errorlevel 1 goto check
start "" "http://localhost:8080"
