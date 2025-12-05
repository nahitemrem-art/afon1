# ⚡ Windows Hızlı Kurulum

## 🚨 HATALAR VE ÇÖZÜMLER

### Hata 1: "expo-router plugin hatası"
✅ **Çözüldü!** app.json düzeltildi.

### Hata 2: "ts-node-dev is not recognized"
❌ **Sebep**: Backend dependencies yüklenmemiş

### Hata 3: "concurrently is not recognized"  
❌ **Sebep**: Root dependencies yüklenmemiş

---

## ✅ DOĞRU KURULUM ADIMLARI

### Adım 1: Backend Dependencies
```powershell
cd C:\Users\admin\Downloads\afon1\backend
npm install
```

**Beklenen süre**: 2-3 dakika
**Dosya boyutu**: ~200-300 MB

### Adım 2: Mobile Dependencies (Zaten yaptınız ✓)
```powershell
cd C:\Users\admin\Downloads\afon1\mobile
# Zaten yaptınız, tekrar gerek yok
```

### Adım 3: Root Dependencies (İsteğe Bağlı)
```powershell
cd C:\Users\admin\Downloads\afon1
npm install
```

---

## 🚀 UYGULAMAYI BAŞLATMA

### Seçenek A: Ayrı Terminal'ler (ÖNERİLEN)

**Terminal 1 - Backend:**
```powershell
cd C:\Users\admin\Downloads\afon1\backend
npm run dev
```

**Başarılı olursa göreceksiniz:**
```
✅ Database initialized
✅ Data sync started
🚀 Server running on http://localhost:3000
```

**Terminal 2 - Mobile (yeni PowerShell):**
```powershell
cd C:\Users\admin\Downloads\afon1\mobile
npm start
```

**Başarılı olursa göreceksiniz:**
```
Starting Metro Bundler
Press w to open in web browser
Press a to open in Android
```

### Seçenek B: Tek Komutla (Root'tan)
```powershell
cd C:\Users\admin\Downloads\afon1
npm run dev
```

---

## 📱 UYGULAMAYI AÇMA

### Web'de Açmak İçin:
1. Mobile terminal'de **`w`** tuşuna basın
2. Tarayıcı otomatik açılır
3. URL: http://localhost:8081

### Android'de Açmak İçin:
1. Telefonunuza "Expo Go" yükleyin (Play Store)
2. QR kodu tarayın
3. Uygulama açılır

---

## 🔍 ADIM ADIM KONTROL

### 1. Backend Çalışıyor mu?
```powershell
# Test et:
curl http://localhost:3000/health
```

**Başarılı yanıt:**
```json
{"status":"ok","timestamp":"2024-12-04T..."}
```

### 2. Dependencies Yüklü mü?
```powershell
# Backend kontrolü
cd backend
dir node_modules  # Klasör varsa ✓

# Mobile kontrolü  
cd ..\mobile
dir node_modules  # Klasör varsa ✓
```

### 3. Portlar Müsait mi?
```powershell
# Port 3000 kullanımda mı?
netstat -ano | findstr :3000

# Eğer kullanımdaysa, işlemi sonlandır:
# taskkill /PID <PID_NUMARASI> /F
```

---

## 🐛 HATA ÇÖZÜMLEME

### Hata: "Cannot find module 'express'"
```powershell
cd backend
Remove-Item node_modules -Recurse -Force
npm install
```

### Hata: "EADDRINUSE :::3000"
Port zaten kullanımda, durdurun:
```powershell
# Port 3000'i kim kullanıyor?
netstat -ano | findstr :3000

# Sonlandır (PID ile)
taskkill /PID <PID> /F

# Veya .env'de port değiştir
# backend\.env → PORT=3001
```

### Hata: "Expo Metro Bundler başlamıyor"
```powershell
cd mobile
npx expo start --clear
# veya
npx expo start -c
```

### Hata: "TEFAS API'ye bağlanamıyor"
1. İnternet bağlantısı var mı?
2. Firewall/Antivirus kapalı mı?
3. VPN kullanıyor musunuz?

---

## 📋 KURULUM KONTROL LİSTESİ

- [ ] Node.js 18+ yüklü
- [ ] Backend npm install yapıldı
- [ ] Mobile npm install yapıldı
- [ ] Backend başladı (localhost:3000)
- [ ] Mobile başladı (Expo)
- [ ] Web'de açıldı veya QR tarandı
- [ ] API çalışıyor (health check)

---

## 🎯 ŞİMDİ NE YAPMALIYIM?

### ADIM 1: Backend'i Başlat
```powershell
cd C:\Users\admin\Downloads\afon1\backend
npm install
npm run dev
```

**Çıktı görmeli:**
```
✅ Database initialized
✅ Data sync started
Fetching all funds from TEFAS API...
🚀 Server running on http://localhost:3000
```

### ADIM 2: Mobile'ı Başlat (Yeni Terminal)
```powershell
cd C:\Users\admin\Downloads\afon1\mobile
npm start
```

**Çıktı görmeli:**
```
› Metro waiting on exp://192.168.x.x:8081
› Scan the QR code above with Expo Go
```

### ADIM 3: Web'de Aç
Terminal'de **`w`** tuşuna bas

---

## 💡 İPUÇLARI

### Backend Log'larını İzleyin
```
Fetching all funds from TEFAS API...
✅ Fetched 450 funds from TEFAS
```

Bu çıktıyı görürseniz = Başarılı! 🎉

### Arama Test Edin
Backend çalıştıktan sonra:
```powershell
# Fon ara
curl "http://localhost:3000/api/search?q=ABD"
```

### Cache Temizleme
```powershell
# Mobile cache temizle
cd mobile
Remove-Item -Recurse -Force .expo
npm start -- --clear
```

---

## 🔄 TAMAMEN YENİDEN BAŞLAMA

Eğer çok karışırsa:

```powershell
# 1. Tüm işlemleri durdur (Ctrl+C)

# 2. Node_modules'ları sil
cd C:\Users\admin\Downloads\afon1
Remove-Item backend\node_modules -Recurse -Force
Remove-Item mobile\node_modules -Recurse -Force
Remove-Item node_modules -Recurse -Force

# 3. Yeniden kur
cd backend
npm install

cd ..\mobile  
npm install

# 4. Başlat
cd ..\backend
npm run dev

# 5. Yeni terminal - Mobile
cd ..\mobile
npm start
```

---

## ✅ BAŞARI KONTROL

### Backend Başarılı:
```
✅ Database initialized
✅ Data sync started
🚀 Server running on http://localhost:3000
Fetching all funds from TEFAS API...
✅ Fetched XXX funds from TEFAS
```

### Mobile Başarılı:
```
› Metro waiting on exp://...
› Press w to open in web browser
› Press a to open in Android
```

### Web Açıldı:
- Tarayıcıda uygulama görünüyor
- "Ara" sekmesi var
- Fonları arayabiliyorsunuz

---

## 🆘 HALA SORUN VARSA

1. **Terminal çıktısını kopyalayın**
2. **Hangi adımda hata aldığınızı not edin**
3. **Hata mesajının tamamını paylaşın**

Örnek hata paylaşımı:
```
ADIM: Backend npm install
HATA: gyp ERR! find VS
ÇÖZÜM: Windows SDK yükle
```

---

**ŞİMDİ DENEYİN! 🚀**

```powershell
cd C:\Users\admin\Downloads\afon1\backend
npm install
```

Bu komutu çalıştırın ve sonucu bana gönderin!
