# 🎯 Hemen Başlayın!

TEFAS Tracker'ı çalıştırmak için hızlı rehber.

## ⚡ Hızlı Kurulum (5 dakika)

### 1️⃣ Gereksinimleri Kontrol Edin

```bash
# Node.js versiyonunu kontrol edin (18+ olmalı)
node -v

# npm versiyonunu kontrol edin
npm -v
```

Node.js yüklü değilse: https://nodejs.org/

### 2️⃣ Projeyi Hazırlayın

```bash
# Setup scriptini çalıştırın
./scripts/setup.sh

# Veya manuel olarak:
cd backend && npm install && cd ..
cd mobile && npm install && cd ..
```

### 3️⃣ Sunucuları Başlatın

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

Backend çalışıyor mu kontrol edin: http://localhost:3000/health

**Terminal 2 - Mobil Uygulama:**
```bash
cd mobile
npm start
```

Ardından:
- **Web için**: `w` tuşuna basın
- **Android için**: `a` tuşuna basın

### 4️⃣ Örnek Veri Ekleyin (Opsiyonel)

```bash
cd backend
npm run seed
```

## 🎨 İlk Kullanım

### Fonları Görüntüleme
1. Uygulama "Fonlar" sekmesinde açılır
2. Tüm TEFAS fonlarını görebilirsiniz
3. Arama kutusundan fon arayabilirsiniz
4. Sıralama butonları ile sıralayabilirsiniz

### Favorilere Ekleme
1. Herhangi bir fonun üzerindeki ⭐ yıldız ikonuna tıklayın
2. "Favoriler" sekmesine gidin
3. Favori fonlarınızı görün

### Portföy Oluşturma
1. "Portföy" sekmesine gidin
2. Sağ alttaki + butonuna tıklayın
3. Portföy adı girin
4. Fonları portföyünüze ekleyin

### Canlı Takip
1. "Canlı" sekmesine gidin
2. Gün içi tahmini getirileri görün
3. Otomatik olarak her dakika güncellenir

## 🔧 Sorun Giderme

### Backend başlamıyor
```bash
# Port 3000 kullanımda olabilir, .env dosyasını düzenleyin:
cd backend
nano .env
# PORT=3001 olarak değiştirin
```

### Mobil uygulama API'ye bağlanamıyor

**Android Emulator için:**
```
# mobile/.env dosyasını düzenleyin:
API_BASE_URL=http://10.0.2.2:3000
```

**Fiziksel cihaz için:**
```
# Bilgisayarınızın IP adresini bulun:
ipconfig getifaddr en0  # Mac
ip addr show  # Linux
ipconfig  # Windows

# mobile/.env dosyasında kullanın:
API_BASE_URL=http://192.168.x.x:3000
```

### Fonlar görünmüyor
```bash
# Örnek veri ekleyin:
cd backend
npm run seed

# Veya TEFAS'tan senkronize olmasını bekleyin (1-2 dakika)
```

## 📱 Fiziksel Cihazda Test

### Android
1. Play Store'dan "Expo Go" uygulamasını indirin
2. Terminal'de gösterilen QR kodu tarayın
3. Cihaz ve bilgisayar aynı ağda olmalı
4. `mobile/.env` dosyasında bilgisayarınızın IP adresini kullanın

### Web Tarayıcı
1. Mobil uygulama başladıktan sonra `w` tuşuna basın
2. Otomatik olarak tarayıcıda açılır
3. Tüm özellikler web'de de çalışır

## 🚀 Gelişmiş Komutlar

### Make ile Hızlı Komutlar
```bash
make install    # Tüm bağımlılıkları yükle
make dev        # Her iki sunucuyu başlat
make seed       # Örnek veri ekle
make stop       # Sunucuları durdur
make clean      # Temizlik yap
```

### Docker ile Çalıştırma
```bash
make docker     # Docker ile başlat
make logs       # Logları görüntüle
make docker-stop # Docker'ı durdur
```

## 📚 Daha Fazla Bilgi

- 📖 [Detaylı Kurulum](docs/SETUP.md)
- 🔌 [API Dokümantasyonu](docs/API.md)
- ✨ [Özellikler](docs/FEATURES.md)
- 🚀 [Production Deployment](docs/DEPLOYMENT.md)
- 🇹🇷 [Türkçe README](README.tr.md)

## 💡 İpuçları

1. **Hot Reload**: Kod değişikliklerinde otomatik yenilenir
2. **Cache Temizleme**: `expo start -c` ile cache temizlenebilir
3. **Database Sıfırlama**: `backend/data/tefas.db` dosyasını silin
4. **API Test**: `./scripts/test-api.sh` ile API'yi test edin
5. **Hata Logları**: Backend terminal'inde tüm hatalar görünür

## ✅ Başarı Kontrol Listesi

- [ ] Node.js 18+ yüklü
- [ ] Backend çalışıyor (http://localhost:3000/health açılıyor)
- [ ] Mobil uygulama başladı
- [ ] Fonlar görüntüleniyor
- [ ] Favoriler çalışıyor
- [ ] Portföy oluşturulabiliyor

## 🎉 Tebrikler!

Artık TEFAS Tracker'ı kullanmaya hazırsınız!

Sorularınız için:
- 📖 Dokümantasyonu okuyun
- 🐛 Issue açın
- 💬 Discussions bölümünde sorun

**Happy Tracking! 📈**
