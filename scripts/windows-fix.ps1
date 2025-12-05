# TEFAS Tracker - Hızlı Düzeltme Scripti
Write-Host "╔══════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║  TEFAS TRACKER - HATA DÜZELTİCİ             ║" -ForegroundColor Cyan
Write-Host "╚══════════════════════════════════════════════╝" -ForegroundColor Cyan
Write-Host ""

$currentPath = Get-Location
$projectRoot = Split-Path -Parent $PSScriptRoot

Write-Host "🔍 Hangi sorunu çözmek istiyorsunuz?" -ForegroundColor Yellow
Write-Host ""
Write-Host "1. Backend hatası (better-sqlite3)" -ForegroundColor White
Write-Host "2. Mobile web hatası (App bulunamıyor)" -ForegroundColor White
Write-Host "3. Her ikisi de" -ForegroundColor White
Write-Host ""

$choice = Read-Host "Seçiminiz (1-3)"

if ($choice -eq "1" -or $choice -eq "3") {
    Write-Host ""
    Write-Host "═══════════════════════════════════════════" -ForegroundColor Cyan
    Write-Host "  BACKEND DÜZELTİLİYOR" -ForegroundColor Cyan
    Write-Host "═══════════════════════════════════════════" -ForegroundColor Cyan
    Write-Host ""
    
    Set-Location "$projectRoot\backend"
    
    Write-Host "📦 sql.js versiyonu kullanılıyor..." -ForegroundColor Yellow
    Copy-Item "package-windows.json" "package.json" -Force
    Write-Host "✅ package.json güncellendi" -ForegroundColor Green
    
    Write-Host ""
    Write-Host "🧹 node_modules temizleniyor..." -ForegroundColor Yellow
    if (Test-Path "node_modules") {
        Remove-Item "node_modules" -Recurse -Force -ErrorAction SilentlyContinue
        Write-Host "✅ Temizlendi" -ForegroundColor Green
    }
    
    Write-Host ""
    Write-Host "📦 Dependencies yükleniyor (sql.js)..." -ForegroundColor Yellow
    Write-Host "   (Bu 2-3 dakika sürebilir)" -ForegroundColor Gray
    npm install
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host ""
        Write-Host "✅ Backend düzeltildi!" -ForegroundColor Green
        Write-Host ""
        Write-Host "Başlatmak için:" -ForegroundColor Cyan
        Write-Host "  cd backend" -ForegroundColor White
        Write-Host "  npm run dev" -ForegroundColor White
    } else {
        Write-Host ""
        Write-Host "❌ Hata oluştu!" -ForegroundColor Red
    }
    
    Set-Location $projectRoot
}

if ($choice -eq "2" -or $choice -eq "3") {
    Write-Host ""
    Write-Host "═══════════════════════════════════════════" -ForegroundColor Cyan
    Write-Host "  MOBILE DÜZELTİLİYOR" -ForegroundColor Cyan
    Write-Host "═══════════════════════════════════════════" -ForegroundColor Cyan
    Write-Host ""
    
    Set-Location "$projectRoot\mobile"
    
    Write-Host "🧹 Cache temizleniyor..." -ForegroundColor Yellow
    if (Test-Path ".expo") {
        Remove-Item ".expo" -Recurse -Force -ErrorAction SilentlyContinue
        Write-Host "✅ .expo temizlendi" -ForegroundColor Green
    }
    
    if (Test-Path ".metro-health-check*") {
        Remove-Item ".metro-health-check*" -Force -ErrorAction SilentlyContinue
    }
    
    Write-Host ""
    Write-Host "✅ Mobile cache temizlendi!" -ForegroundColor Green
    Write-Host ""
    Write-Host "Başlatmak için:" -ForegroundColor Cyan
    Write-Host "  cd mobile" -ForegroundColor White
    Write-Host "  npx expo start --clear" -ForegroundColor White
    Write-Host "  (Sonra 'w' tuşuna bas)" -ForegroundColor Gray
    
    Set-Location $projectRoot
}

Write-Host ""
Write-Host "═══════════════════════════════════════════" -ForegroundColor Green
Write-Host "  ✅ İŞLEM TAMAMLANDI" -ForegroundColor Green
Write-Host "═══════════════════════════════════════════" -ForegroundColor Green
Write-Host ""

Set-Location $currentPath
