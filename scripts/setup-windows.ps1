# TEFAS Tracker - Windows Setup Script
Write-Host "🚀 TEFAS Tracker Windows Kurulum" -ForegroundColor Cyan
Write-Host "================================" -ForegroundColor Cyan
Write-Host ""

# Node.js kontrolü
Write-Host "📋 Node.js kontrolü..." -ForegroundColor Yellow
$nodeVersion = node -v 2>$null
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Node.js bulunamadı. Lütfen Node.js 18+ yükleyin." -ForegroundColor Red
    Write-Host "   İndir: https://nodejs.org/" -ForegroundColor Yellow
    exit 1
}
Write-Host "✅ Node.js $nodeVersion tespit edildi" -ForegroundColor Green
Write-Host ""

# Better-sqlite3 sorunu için çözüm seçenekleri
Write-Host "🔧 Backend Kurulum Seçenekleri:" -ForegroundColor Cyan
Write-Host "1. Docker kullan (Önerilen - Build sorunu yok)" -ForegroundColor White
Write-Host "2. sql.js kullan (Pure JavaScript - Build sorunu yok)" -ForegroundColor White
Write-Host "3. better-sqlite3 kullan (Windows Build Tools gerekli)" -ForegroundColor White
Write-Host "4. Sadece Mobile App'i kur (Backend başka yerde çalışacak)" -ForegroundColor White
Write-Host ""

$choice = Read-Host "Seçiminiz (1-4)"

switch ($choice) {
    "1" {
        Write-Host ""
        Write-Host "🐳 Docker ile kurulum başlatılıyor..." -ForegroundColor Cyan
        
        # Docker kontrolü
        docker --version 2>$null | Out-Null
        if ($LASTEXITCODE -ne 0) {
            Write-Host "❌ Docker bulunamadı. Docker Desktop yükleyin." -ForegroundColor Red
            Write-Host "   İndir: https://www.docker.com/products/docker-desktop" -ForegroundColor Yellow
            exit 1
        }
        
        Write-Host "✅ Docker bulundu" -ForegroundColor Green
        Write-Host ""
        Write-Host "📦 Docker servisleri başlatılıyor..." -ForegroundColor Yellow
        docker-compose up -d
        
        if ($LASTEXITCODE -eq 0) {
            Write-Host "✅ Backend Docker'da çalışıyor!" -ForegroundColor Green
            Write-Host "   URL: http://localhost:3000" -ForegroundColor Cyan
        }
    }
    
    "2" {
        Write-Host ""
        Write-Host "📦 sql.js ile backend kurulumu..." -ForegroundColor Cyan
        
        # Backend package.json değiştir
        Set-Location backend
        Copy-Item package-windows.json package.json -Force
        Write-Host "✅ Windows-compatible package.json kullanılıyor" -ForegroundColor Green
        
        Write-Host "📦 Backend dependencies yükleniyor..." -ForegroundColor Yellow
        npm install
        
        if ($LASTEXITCODE -eq 0) {
            Write-Host "✅ Backend kurulumu tamamlandı!" -ForegroundColor Green
        } else {
            Write-Host "❌ Backend kurulumu başarısız" -ForegroundColor Red
            exit 1
        }
        
        Set-Location ..
    }
    
    "3" {
        Write-Host ""
        Write-Host "⚠️  Windows Build Tools gerekli!" -ForegroundColor Yellow
        Write-Host ""
        Write-Host "Kurulum adımları:" -ForegroundColor Cyan
        Write-Host "1. Visual Studio Installer'ı açın" -ForegroundColor White
        Write-Host "2. 'Desktop development with C++' workload'ı yükleyin" -ForegroundColor White
        Write-Host "3. Bu scripti tekrar çalıştırın" -ForegroundColor White
        Write-Host ""
        Write-Host "Devam etmek istiyor musunuz? (y/n)" -ForegroundColor Yellow
        $continue = Read-Host
        
        if ($continue -ne "y") {
            Write-Host "Kurulum iptal edildi." -ForegroundColor Yellow
            exit 0
        }
        
        Write-Host "📦 Backend dependencies yükleniyor..." -ForegroundColor Yellow
        Set-Location backend
        npm install
        
        if ($LASTEXITCODE -eq 0) {
            Write-Host "✅ Backend kurulumu tamamlandı!" -ForegroundColor Green
        } else {
            Write-Host "❌ Build hatası! Yukarıdaki adımları kontrol edin." -ForegroundColor Red
            Write-Host "   Veya seçenek 1 (Docker) veya 2 (sql.js) ile deneyin." -ForegroundColor Yellow
            exit 1
        }
        
        Set-Location ..
    }
    
    "4" {
        Write-Host ""
        Write-Host "📱 Sadece Mobile App kurulumu..." -ForegroundColor Cyan
        Write-Host "⚠️  Backend'i başka bir yerde çalıştırmanız gerekecek" -ForegroundColor Yellow
        Write-Host ""
    }
    
    default {
        Write-Host "❌ Geçersiz seçim!" -ForegroundColor Red
        exit 1
    }
}

# Mobile kurulum (tüm seçenekler için)
Write-Host ""
Write-Host "📱 Mobile App kurulumu..." -ForegroundColor Cyan
Set-Location mobile

if (-Not (Test-Path ".env")) {
    Write-Host "📝 .env dosyası oluşturuluyor..." -ForegroundColor Yellow
    Copy-Item .env.example .env
    
    if ($choice -eq "4") {
        Write-Host ""
        Write-Host "⚠️  .env dosyasını düzenlemeyi unutmayın!" -ForegroundColor Yellow
        Write-Host "   API_BASE_URL=http://YOUR_BACKEND_URL" -ForegroundColor Cyan
    }
}

Write-Host "📦 Mobile dependencies yükleniyor..." -ForegroundColor Yellow
npm install

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Mobile kurulumu tamamlandı!" -ForegroundColor Green
} else {
    Write-Host "❌ Mobile kurulumu başarısız" -ForegroundColor Red
    exit 1
}

Set-Location ..

# Özet
Write-Host ""
Write-Host "🎉 Kurulum Tamamlandı!" -ForegroundColor Green
Write-Host "=====================" -ForegroundColor Green
Write-Host ""

if ($choice -eq "1") {
    Write-Host "Backend: Docker'da çalışıyor (http://localhost:3000)" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "Mobile başlatmak için:" -ForegroundColor Yellow
    Write-Host "  cd mobile" -ForegroundColor White
    Write-Host "  npm start" -ForegroundColor White
} elseif ($choice -eq "2" -or $choice -eq "3") {
    Write-Host "Backend başlatmak için:" -ForegroundColor Yellow
    Write-Host "  cd backend" -ForegroundColor White
    Write-Host "  npm run dev" -ForegroundColor White
    Write-Host ""
    Write-Host "Mobile başlatmak için (yeni terminal):" -ForegroundColor Yellow
    Write-Host "  cd mobile" -ForegroundColor White
    Write-Host "  npm start" -ForegroundColor White
} else {
    Write-Host "Mobile başlatmak için:" -ForegroundColor Yellow
    Write-Host "  cd mobile" -ForegroundColor White
    Write-Host "  npm start" -ForegroundColor White
    Write-Host ""
    Write-Host "⚠️  Backend'i ayrı bir yerde çalıştırmayı unutmayın!" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "📚 Daha fazla bilgi için:" -ForegroundColor Cyan
Write-Host "  - WINDOWS_SETUP.md" -ForegroundColor White
Write-Host "  - QUICKSTART.md" -ForegroundColor White
Write-Host "  - GET_STARTED.md" -ForegroundColor White
Write-Host ""
Write-Host "Happy Coding! 🚀" -ForegroundColor Cyan
