# TEFAS Tracker Windows Kurulum Scripti
# PowerShell'i Administrator olarak çalıştırın

Write-Host "================================" -ForegroundColor Cyan
Write-Host "  TEFAS TRACKER KURULUM" -ForegroundColor Cyan
Write-Host "================================" -ForegroundColor Cyan
Write-Host ""

# Node.js kontrolü
Write-Host "🔍 Node.js kontrolü..." -ForegroundColor Yellow
try {
    $nodeVersion = node -v
    Write-Host "✅ Node.js bulundu: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Node.js bulunamadı!" -ForegroundColor Red
    Write-Host "   Node.js indirin: https://nodejs.org/" -ForegroundColor Yellow
    exit 1
}
Write-Host ""

# Backend kurulum
Write-Host "📦 Backend dependencies yükleniyor..." -ForegroundColor Yellow
Set-Location backend

if (Test-Path "node_modules") {
    Write-Host "   ⚠️  node_modules zaten mevcut, temizleniyor..." -ForegroundColor Yellow
    Remove-Item node_modules -Recurse -Force -ErrorAction SilentlyContinue
}

Write-Host "   npm install çalıştırılıyor..." -ForegroundColor Cyan
npm install

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Backend kurulumu başarılı!" -ForegroundColor Green
} else {
    Write-Host "❌ Backend kurulumu başarısız!" -ForegroundColor Red
    Write-Host "   Hata kodu: $LASTEXITCODE" -ForegroundColor Red
    exit 1
}

Set-Location ..
Write-Host ""

# .env dosyası oluştur
if (-Not (Test-Path "backend\.env")) {
    Write-Host "📝 Backend .env dosyası oluşturuluyor..." -ForegroundColor Yellow
    Copy-Item "backend\.env.example" "backend\.env"
    Write-Host "✅ .env oluşturuldu" -ForegroundColor Green
}
Write-Host ""

# Mobile kurulum
Write-Host "📦 Mobile dependencies yükleniyor..." -ForegroundColor Yellow
Set-Location mobile

if (Test-Path "node_modules") {
    Write-Host "   ⚠️  node_modules zaten mevcut, atlaniyor..." -ForegroundColor Yellow
} else {
    Write-Host "   npm install çalıştırılıyor..." -ForegroundColor Cyan
    npm install
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Mobile kurulumu başarılı!" -ForegroundColor Green
    } else {
        Write-Host "❌ Mobile kurulumu başarısız!" -ForegroundColor Red
        exit 1
    }
}

Set-Location ..
Write-Host ""

# .env dosyası oluştur
if (-Not (Test-Path "mobile\.env")) {
    Write-Host "📝 Mobile .env dosyası oluşturuluyor..." -ForegroundColor Yellow
    Copy-Item "mobile\.env.example" "mobile\.env"
    Write-Host "✅ .env oluşturuldu" -ForegroundColor Green
}
Write-Host ""

# Özet
Write-Host "================================" -ForegroundColor Green
Write-Host "  ✅ KURULUM TAMAMLANDI!" -ForegroundColor Green
Write-Host "================================" -ForegroundColor Green
Write-Host ""
Write-Host "Uygulamayı başlatmak için:" -ForegroundColor Cyan
Write-Host ""
Write-Host "Terminal 1 - Backend:" -ForegroundColor Yellow
Write-Host "  cd backend" -ForegroundColor White
Write-Host "  npm run dev" -ForegroundColor White
Write-Host ""
Write-Host "Terminal 2 - Mobile:" -ForegroundColor Yellow
Write-Host "  cd mobile" -ForegroundColor White
Write-Host "  npm start" -ForegroundColor White
Write-Host ""
Write-Host "Veya otomatik başlatma:" -ForegroundColor Yellow
Write-Host "  .\scripts\windows-baslatma.ps1" -ForegroundColor White
Write-Host ""
Write-Host "📚 Daha fazla bilgi: WINDOWS_HIZLI_KURULUM.md" -ForegroundColor Cyan
Write-Host ""
