# TEFAS Tracker Windows Başlatma Scripti
Write-Host "================================" -ForegroundColor Cyan
Write-Host "  TEFAS TRACKER BAŞLATILIYOR" -ForegroundColor Cyan
Write-Host "================================" -ForegroundColor Cyan
Write-Host ""

# Backend'i başlat
Write-Host "🚀 Backend başlatılıyor..." -ForegroundColor Yellow
Write-Host "   URL: http://localhost:3000" -ForegroundColor Cyan
Write-Host ""

$backendPath = Join-Path $PSScriptRoot "..\backend"
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$backendPath'; Write-Host '🔧 BACKEND SERVER' -ForegroundColor Green; Write-Host ''; npm run dev"

Start-Sleep -Seconds 3

# Mobile'ı başlat
Write-Host "📱 Mobile başlatılıyor..." -ForegroundColor Yellow
Write-Host "   Expo Dev Server" -ForegroundColor Cyan
Write-Host ""

$mobilePath = Join-Path $PSScriptRoot "..\mobile"
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$mobilePath'; Write-Host '📱 MOBILE APP' -ForegroundColor Green; Write-Host ''; npm start"

Write-Host ""
Write-Host "✅ Her iki servis de başlatıldı!" -ForegroundColor Green
Write-Host ""
Write-Host "📋 Kontrol:" -ForegroundColor Yellow
Write-Host "   Backend: http://localhost:3000/health" -ForegroundColor White
Write-Host "   Mobile:  Yeni terminalde QR kodu göreceksiniz" -ForegroundColor White
Write-Host ""
Write-Host "💡 İpucu:" -ForegroundColor Cyan
Write-Host "   Mobile terminalinde 'w' tuşuna basarak web'de açabilirsiniz" -ForegroundColor White
Write-Host ""
