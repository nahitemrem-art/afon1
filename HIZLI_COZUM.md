# ⚡ Windows'ta Hızlı Çözüm

## 🎯 Sorun
`better-sqlite3` paketi Windows'ta C++ build tools gerektiriyor ve kurulum hatası veriyor.

## ✅ EN KOLAY ÇÖZÜM (Önerilen)

### Yöntem 1: Docker Kullan (5 dakika)

```powershell
# Docker Desktop yüklüyse:
docker-compose up -d

# Mobile başlat
cd mobile
npm install
npm start
```

✅ **Avantajları:**
- Build sorunu yok
- Production ortamına en yakın
- Kolay cleanup

### Yöntem 2: Sadece Mobile Uygulamayı Çalıştır

Backend'e ihtiyacınız yoksa direkt mobil uygulamayı test edin:

```powershell
cd mobile
npm install
npm start
```

**Expo Go ile Test:**
1. Telefonunuza "Expo Go" uygulamasını indirin
2. QR kodu tarayın
3. Uygulama açılacak!

## 🔧 Backend'i Mutlaka Local Çalıştırmalıyım

### Seçenek A: Node.js 20.x Kullan

Node.js 22.x yerine 20.x LTS kullanın (daha stabil):

```powershell
# Node.js 20.x indir: https://nodejs.org/en/download/
# Sonra:
cd backend
npm install
```

### Seçenek B: Windows Build Tools Yükle

1. **Visual Studio Installer** açın
2. **Modify** tıklayın (VS 2022 BuildTools için)
3. **Individual Components** sekmesine gidin
4. Şunları seçin:
   - ✅ MSVC v143 - VS 2022 C++ x64/x86 build tools
   - ✅ Windows 10 SDK (10.0.19041.0 veya üzeri)
5. **Modify** tıklayıp yükleyin

Sonra:
```powershell
cd backend
Remove-Item node_modules -Recurse -Force
npm install
```

## 🚀 Hızlı Başlangıç Adımları

### 1. Projeyi Kısa Path'e Taşı
```powershell
# Windows path uzunluk problemlerinden kaçınmak için
Move-Item "C:\Users\admin\Downloads\afon1..." "C:\tefas"
cd C:\tefas
```

### 2. PowerShell'i Administrator Olarak Çalıştır
Sağ tık → "Run as Administrator"

### 3. Setup Script Çalıştır
```powershell
# Execution policy ayarla (ilk seferinde)
Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass

# Setup çalıştır
.\scripts\setup-windows.ps1
```

## 📱 Expo Go ile Test (Backend Olmadan)

Mobile uygulamayı backend olmadan da test edebilirsiniz:

```powershell
cd mobile
npm install
npm start
```

Sonra:
- **Web**: `w` tuşuna bas
- **Android**: Expo Go ile QR kodu tara

## 🐛 Hala Sorun mu Var?

### Hata: "gyp ERR! find VS"
**Çözüm:** Visual Studio Build Tools ve Windows SDK yükleyin (Seçenek B)

### Hata: "EPERM: operation not permitted"
**Çözüm:** 
1. PowerShell'i Administrator olarak çalıştırın
2. Antivirus'ü geçici olarak kapatın
3. Projeyi kısa path'e taşıyın

### Hata: "prebuild-install warn"
**Çözüm:** Normal, build tools yoksa kendi build ediyor. Windows SDK gerekli.

## 💡 En Pratik Yol

Eğer sadece uygulamayı görmek istiyorsanız:

```powershell
# Adım 1: Mobile kur
cd mobile
npm install

# Adım 2: Başlat
npm start

# Adım 3: Web'de aç
# Terminal'de 'w' tuşuna bas
```

Backend olmadan bile UI'ı görebilirsiniz!

## 🎯 Sonuç

| Durum | Çözüm |
|-------|-------|
| **Sadece UI görmek istiyorum** | Mobile → npm start → 'w' bas |
| **Full app test** | Docker Compose kullan |
| **Development yapacağım** | Build tools yükle veya Node 20.x |
| **Production** | Docker kullan |

## 📞 Hızlı Yardım

```powershell
# 1. Backend çalışıyor mu?
curl http://localhost:3000/health

# 2. Mobile dependencies yüklü mü?
cd mobile
npm list

# 3. Node versiyonu?
node -v  # 20.x idealdir

# 4. Docker çalışıyor mu?
docker ps
```

## ✨ Tebrikler!

Artık uygulamayı çalıştırabilirsiniz! 🎉

Backend sorunu varsa Discord/Telegram'dan destek alabilirsiniz.
