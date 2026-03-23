@echo off
chcp 65001 >nul
echo Установка всех библиотек (npm install)...
call npm install
echo.
echo Запуск локального сервера Vite...
echo Перейди в браузере по адресу: http://localhost:5173
call npm run dev
pause
