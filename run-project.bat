@echo off
title Run start Music Player

echo Starting backend...
start cmd /k "cd nestjs-backend && npm start"

echo Starting frontend...
start cmd /k "cd nextjs-frontend && npm run dev"


echo Opening Visual Studio Code...
start cmd /k "cd . && code ."

echo All projects are starting...