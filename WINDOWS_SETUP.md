# Windows Kurulum Rehberi

## ⚠️ better-sqlite3 Build Hatası

Windows'ta `better-sqlite3` native module build etmek için Visual Studio Build Tools gerekiyor.

## 🚀 Hızlı Çözümler

### Çözüm 1: Windows Build Tools Yükle (Önerilen)

**Adım 1: Windows SDK Yükle**
1. Visual Studio Installer'ı açın
2. "Modify" tıklayın (Visual Studio 2022 BuildTools için)
3. "Individual components" sekmesine gidin
4. Aşağıdakileri seçin:
   - ✅ Windows 10 SDK (veya Windows 11 SDK)
   - ✅ MSVC v143 - VS 2022 C++ x64/x86 build tools
5. "Modify" tıklayın ve yükleme tamamlanmasını bekleyin

**Adım 2: Terminal'i Yeniden Başlat**
PowerShell'i kapatıp yeniden açın (Administrator olarak)

**Adım 3: Yeniden Dene**
```powershell
cd backend
Remove-Item node_modules -Recurse -Force -ErrorAction SilentlyContinue
npm install
```

### Çözüm 2: Docker Kullan (En Kolay)

Docker ile build sorunlarını tamamen atlayın:

```powershell
# Backend için
cd backend
docker build -t tefas-backend .
docker run -p 3000:3000 tefas-backend

# Veya docker-compose ile
cd ..
docker-compose up
```

### Çözüm 3: Pure JavaScript SQLite Kullan

Backend'i `sql.js` ile çalıştırmak için:

**package.json'ı Güncelle:**
```powershell
cd backend
npm uninstall better-sqlite3
npm install sql.js @types/sql.js
```

### Çözüm 4: Remote Backend Kullan

Backend'i başka bir makinede (Linux/Mac veya online service) çalıştırıp sadece frontend'i lokal çalıştırın:

```powershell
cd mobile
# .env dosyasını düzenle
# API_BASE_URL=https://your-backend-url.com
npm install
npm start
```

## 🎯 Mobil Uygulama için Hızlı Başlangıç

Sadece mobil uygulamayı test etmek istiyorsanız:

### Opsiyon A: Mock Data ile Test

```powershell
cd mobile
npm install
npm start
# 'w' basarak web'de aç veya 'a' basarak Android'de aç
```

Backend olmadan çalışması için mock data ekleyeceğiz.

### Opsiyon B: Hazır Backend Kullan

Hızlıca test etmek için online bir backend servisi kullanın (örn: Railway, Render, Heroku)

## 📱 Sadece Android Uygulaması Çalıştırma

Backend sorununu atlamak ve direkt mobil uygulamayı test etmek için:

```powershell
# 1. Mobile dizinine git
cd mobile

# 2. Dependencies yükle
npm install

# 3. Expo'yu başlat
npm start

# 4. Expo Go ile tarayın
# QR kodu Expo Go app ile tarayın veya 'w' basarak web'de açın
```

## 🔍 Hangi Çözümü Seçmeliyim?

| Senaryo | Önerilen Çözüm |
|---------|----------------|
| **Sadece Android uygulamayı test etmek istiyorum** | Çözüm 4 (Remote Backend) veya Mock Data |
| **Full stack development yapacağım** | Çözüm 1 (Build Tools) veya Çözüm 2 (Docker) |
| **Hızlı prototip** | Çözüm 2 (Docker) |
| **Production deployment** | Çözüm 1 veya Çözüm 2 |

## ⚡ En Hızlı Yol (Expo Go Kullanıyorsanız)

```powershell
# Terminal 1 - Backend'i Docker ile başlat
docker-compose up

# Terminal 2 - Mobile uygulamayı başlat
cd mobile
npm install
npm start

# Expo Go'dan QR kodu tarayın!
```

## 🆘 Sorun Devam Ederse

1. **Node.js versiyonunu kontrol edin:**
   ```powershell
   node -v  # 18.x veya 20.x olmalı
   ```

2. **npm cache temizle:**
   ```powershell
   npm cache clean --force
   ```

3. **Administrator olarak çalıştırın:**
   PowerShell'i "Run as Administrator" ile açın

4. **Path'i kontrol edin:**
   ```powershell
   echo $env:Path
   ```

## 💡 İpuçları

- Windows'ta uzun path sorunları varsa projeyi kısa bir yola taşıyın (örn: `C:\tefas\`)
- Antivirus geçici olarak devre dışı bırakın
- Terminal'i Administrator olarak çalıştırın
- Node.js'i LTS versiyonunu kullanın (22.x yerine 20.x)

## 🐳 Docker ile Hızlı Başlatma (Önerilen)

Docker masaüstü yüklüyse en kolay yol:

```powershell
# Proje kök dizininde
docker-compose up -d

# Backend çalışıyor mu kontrol et
curl http://localhost:3000/health

# Mobile başlat
cd mobile
npm install  # Bu sorunsuz çalışır
npm start
```

Başarılar! 🚀
