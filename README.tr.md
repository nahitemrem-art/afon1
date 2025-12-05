# TEFAS Fon Takip Uygulaması

Türkiye'deki yatırım fonlarını (TEFAS) takip edebileceğiniz, hem web hem de Android'de çalışan kapsamlı bir uygulama.

## 🎯 Özellikler

### 1. 📊 Fon Bilgileri
- Tüm TEFAS fonlarını görüntüleme
- Günlük, haftalık, aylık, 3 aylık, 6 aylık ve yıllık getiri bilgileri
- Fon arama ve filtreleme
- Kategorilere göre sıralama
- Detaylı fon bilgileri

### 2. ⭐ Favoriler
- İlgilendiğiniz fonları favorilerinize ekleyin
- Hızlı erişim için tek yerden takip edin
- Kolayca ekleme ve çıkarma

### 3. 💼 Portföy Yönetimi
- Birden fazla portföy oluşturun
- Fonları portföyünüze ekleyin
- Otomatik kar/zarar hesaplama
- Her fonun miktarını ve alış fiyatını takip edin
- Portföy toplam değerini görüntüleyin
- Getiri yüzdesini anlık izleyin

### 4. 📈 Canlı Takip
- Gün içi tahmini fon getirileri
- Her dakika güncelenen veriler
- Tahmin güvenilirlik seviyesi
- Anlık piyasa hareketlerine göre fiyat tahmini

### 5. 🌐 Çoklu Platform
- **Web**: Tarayıcınızdan erişim
- **Android**: Native Android uygulaması
- **Responsive**: Tüm ekran boyutlarına uyumlu

## 🚀 Kurulum

### Gereksinimler
- Node.js 18 veya üzeri
- npm veya yarn
- Android geliştirme için: Android Studio

### Backend Kurulumu

```bash
cd backend
npm install
cp .env.example .env
npm run dev
```

Backend http://localhost:3000 adresinde çalışacaktır.

### Mobil Uygulama Kurulumu

```bash
cd mobile
npm install
cp .env.example .env
npm start
```

Expo geliştirme sunucusu başlayacaktır:
- Web için: `w` tuşuna basın
- Android için: `a` tuşuna basın
- QR kod ile telefonunuzdan Expo Go uygulaması ile tarayın

## 📱 Kullanım

### Fonları Görüntüleme
1. Ana ekranda tüm fonları görebilirsiniz
2. Arama kutusundan fon adı veya kodu ile arayın
3. Sıralama butonları ile farklı kriterlere göre sıralayın
4. Yıldız ikonuna dokunarak favorilere ekleyin

### Portföy Oluşturma
1. Portföy sekmesine gidin
2. Sağ alttaki "+" butonuna dokunun
3. Portföy adı girin ve oluşturun
4. Portföye fon eklemek için portföyü açın
5. Fon kodu, miktar ve alış fiyatı girin

### Canlı Takip
1. Canlı sekmesine gidin
2. Gün içi tahmini getirileri görün
3. Aşağı kaydırarak yenileyin
4. Her dakika otomatik güncellenir

## 🏗️ Proje Yapısı

```
tefas-tracker/
├── backend/           # Node.js API sunucusu
│   ├── src/
│   │   ├── routes/   # API endpoint'leri
│   │   ├── services/ # İş mantığı
│   │   └── database.ts
│   └── package.json
├── mobile/           # React Native Expo uygulaması
│   ├── src/
│   │   ├── screens/  # Ekranlar
│   │   ├── components/ # Bileşenler
│   │   └── api/      # API istemcisi
│   └── package.json
├── shared/           # Paylaşılan tipler
│   └── types.ts
└── docs/            # Dokümantasyon
```

## 🔧 Teknolojiler

### Backend
- **Node.js** + **Express**: API sunucusu
- **TypeScript**: Tip güvenliği
- **SQLite**: Veritabanı
- **Axios**: HTTP istekleri
- **Cheerio**: Web scraping
- **node-cron**: Zamanlı görevler

### Frontend
- **React Native**: Cross-platform UI
- **Expo**: Geliştirme platformu
- **TypeScript**: Tip güvenliği
- **React Navigation**: Sayfa yönlendirme
- **React Query**: Veri yönetimi
- **Axios**: API istekleri

## 📊 Veri Kaynağı

Uygulama, TEFAS (Türkiye Elektronik Fon Alım Satım Platformu) resmi API'sinden veri çeker:
- Günlük fon fiyatları
- Geçmiş performans verileri
- Fon kategorileri
- Portföy bilgileri

## 🔄 Veri Güncelleme

- **Günlük Veriler**: Her hafta içi saat 18:00'de otomatik güncellenir
- **Canlı Tahminler**: Her 5 dakikada bir güncellenir
- **Manuel Yenileme**: Aşağı kaydırarak istediğiniz zaman yenileyebilirsiniz

## 🔒 Gizlilik

- Tüm veriler cihazınızda saklanır
- Kullanıcı hesabı gerektirmez
- Kişisel veri toplanmaz
- Üçüncü taraf izleme yok

## 🤝 Katkıda Bulunma

Katkılarınızı bekliyoruz! Lütfen [CONTRIBUTING.md](CONTRIBUTING.md) dosyasını okuyun.

## 📝 Lisans

Bu proje MIT lisansı altında lisanslanmıştır. Detaylar için [LICENSE](LICENSE) dosyasına bakın.

## 🐛 Hata Bildirimi

Bir hata bulduysanız lütfen issue açın:
- Hatanın açıklaması
- Hatayı tekrarlama adımları
- Beklenen davranış
- Ekran görüntüleri (varsa)

## 💡 Özellik İstekleri

Yeni özellik önerileri için issue açabilirsiniz.

## 📞 İletişim

Sorularınız için issue açabilirsiniz.

## 🙏 Teşekkürler

- TEFAS'a veri API'si için
- Açık kaynak topluluğuna

---

**Not**: Bu uygulama yatırım tavsiyesi değildir. Yatırım kararlarınızı verirken profesyonel danışmanlık alın.
