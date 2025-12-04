# 📱 TEFAS Tracker Kullanım Kılavuzu

## 🎯 Uygulamayı Başlatma

### Backend Başlatma
```powershell
cd backend
npm run dev
```

Backend çalıştığında: http://localhost:3000

### Mobile Başlatma
```powershell
cd mobile
npm start
```

Sonra:
- **Web için**: `w` tuşuna basın
- **Android için**: Expo Go ile QR kodu tarayın

---

## 🔍 1. FON ARAMA

### Nasıl Arama Yapılır?

1. **"Ara" sekmesine** gidin (arama ikonu)
2. Arama kutusuna en az 2 karakter girin
3. Fon kodu veya fon adı ile arayın

### Arama Örnekleri:

```
ABD  → A tipi fonları bulur
GAR  → Garanti bankası fonlarını bulur
HBB  → Halkbank fonlarını bulur
YAT  → Yatırım kelimesini içeren fonları bulur
```

### Arama Özellikleri:

- ✅ **Gerçek Zamanlı**: TEFAS.gov.tr'den direkt veri
- ✅ **Akıllı Arama**: Hem kod hem isim ile arar
- ✅ **Hızlı**: Veritabanında varsa anında, yoksa TEFAS'tan çeker

---

## ⭐ 2. FAVORİLERE EKLEME

### Yöntem 1: Arama Sonucundan
1. Fonları arayın
2. İstediğiniz fonun altında **"Favoriye Ekle"** butonuna basın
3. ⭐ ikonu sarıya döner

### Yöntem 2: Fonlar Listesinden
1. "Fonlar" sekmesine gidin
2. Herhangi bir fonun üstündeki ⭐ ikonuna basın

### Favorileri Görüntüleme
- **"Favoriler"** sekmesine gidin
- Tüm favori fonlarınızı görürsünüz

---

## 💼 3. PORTFÖYE EKLEME

### Adım 1: Fonu Bulun
Arama yapın ve eklemek istediğiniz fonu bulun

### Adım 2: Portföye Ekle Butonuna Basın
Fon kartının altındaki **"Portföye Ekle"** (mavi buton) basın

### Adım 3: Bilgileri Girin

**📋 Lot Sayısı**
- Kaç lot (adet) aldığınızı girin
- Örnek: `100`, `500`, `1000`

**💰 Alış Fiyatı**
- Fonu kaç TL'den aldığınızı girin
- Örnek: `0.025679`, `0.041234`
- Güncel fiyat otomatik doldurulur, değiştirebilirsiniz

**💵 Toplam Tutar**
- Otomatik hesaplanır
- `Lot Sayısı × Alış Fiyatı`

### Adım 4: Portföy Seçin
- Eklemek istediğiniz portföyü seçin
- Portföy yoksa önce "Portföy" sekmesinden oluşturun

---

## 📊 4. PORTFÖY YÖNETİMİ

### Yeni Portföy Oluşturma
1. **"Portföy"** sekmesine gidin
2. Sağ alttaki **+** butonuna basın
3. Portföy adı girin (örn: "Emeklilik", "Kısa Vade")
4. **"Oluştur"** butonuna basın

### Portföyde Göreceğiniz Bilgiler

**📈 Portföy Kartında:**
- Portföy adı
- Kaç fon var
- Toplam portföy değeri
- Toplam kazanç/kayıp (₺)
- Kazanç/kayıp yüzdesi (%)

**📋 Her Fon İçin:**
- Fon kodu
- Kaç lot (adet)
- Ortalama alış fiyatı
- Güncel fiyat
- Toplam değer
- Kar/Zarar (₺ ve %)

### Portföyden Fon Çıkarma
1. Portföyü açın
2. Fonun yanındaki çöp kutusu ikonuna basın
3. Onaylayın

### Portföy Silme
1. Portföy kartındaki çöp kutusu ikonuna basın
2. Onaylayın
3. ⚠️ İçindeki tüm fonlar silinir!

---

## 📈 5. CANLI GETİRİLER

### Nasıl Çalışır?
- **"Canlı"** sekmesinde gün içi tahmini getiriler görürsünüz
- Her 1 dakikada bir otomatik güncellenir
- Piyasa hareketlerine göre tahmin yapar

### Gösterilen Bilgiler:
- Güncel fiyat
- Tahmini fiyat
- Tahmini getiri (%)
- Güven seviyesi (Yüksek/Orta/Düşük)
- Son güncellenme zamanı

⚠️ **Not**: Bunlar tahminlerdir, kesin değildir!

---

## 📋 6. FONLAR LİSTESİ

### Tüm Fonları Görüntüleme
- **"Fonlar"** sekmesinde tüm TEFAS fonları
- Sayfalama ile yüklenir (20'şer)
- Aşağı kaydırarak daha fazla yükleyin

### Sıralama
Üstteki butonlarla sıralayın:
- **İsim**: Alfabetik
- **Günlük**: Günlük getiriye göre
- **Aylık**: Aylık getiriye göre
- **Yıllık**: Yıllık getiriye göre

Her butona tekrar basarak artan/azalan değiştirebilirsiniz

### Arama
Üstteki arama kutusundan fonları filtreleyebilirsiniz

---

## 💡 İPUÇLARI

### 🎯 En İyi Uygulamalar

**Fon Ararken:**
- Tam fon kodunu biliyorsanız direkt yazın (örn: ABD)
- Banka adı ile arayın (örn: GAR, ISB, HBB)
- En az 2-3 karakter girin

**Portföy Oluştururken:**
- Anlamlı isimler verin (Emeklilik, Kısa Vade, vb.)
- Farklı stratejiler için ayrı portföyler
- Düzenli güncelleyin

**Lot ve Fiyat Girerken:**
- Doğru lot sayısı girin
- Alış fiyatını komisyon dahil girin
- Güncel fiyat önerisini kontrol edin

### ⚡ Hızlı Erişim

- **Favoriler**: Sık baktığınız fonları ekleyin
- **Portföy**: Yatırımlarınızı takip edin
- **Arama**: Yeni fon keşfedin
- **Canlı**: Gün içi değişimleri izleyin

---

## 🔄 VERİ GÜNCELLEMESİ

### Otomatik Güncelleme
- Backend başladığında ilk senkronizasyon
- Her hafta içi 18:00'de otomatik güncelleme
- Canlı tahminler her 5 dakikada bir

### Manuel Yenileme
- Aşağı kaydırın (pull-to-refresh)
- Sayfayı yenileyin

---

## ❓ SSS (Sık Sorulan Sorular)

### Fonlar görünmüyor?
✅ Backend çalıştığından emin olun
✅ İlk senkronizasyon için 1-2 dakika bekleyin
✅ İnternet bağlantınızı kontrol edin

### Arama sonuç vermiyor?
✅ En az 2 karakter girin
✅ Türkçe karakter kullanmayın
✅ Fon kodunu büyük harfle yazın

### Portföye ekleyemiyorum?
✅ Önce portföy oluşturun
✅ Lot sayısı ve fiyat girin
✅ Sayısal değerler kullanın (nokta ile ondalık)

### API hatası alıyorum?
✅ Backend'in çalıştığından emin olun
✅ .env dosyasında API_BASE_URL'i kontrol edin
✅ Backend loglarına bakın

---

## 📞 DESTEK

Sorun yaşarsanız:
1. Backend console'u kontrol edin
2. Mobile console'u kontrol edin (F12 web'de)
3. README.md dosyasına bakın
4. GitHub'da issue açın

---

## ✨ ÖRNEK KULLANIM SENARYOSU

### Senaryo: İlk Yatırımım

**1. Fon Araştırması**
```
1. "Ara" sekmesine git
2. "ABD" yaz
3. A tipi fonları incele
4. Beğendiğin fonları favoriye ekle
```

**2. Portföy Oluştur**
```
1. "Portföy" sekmesine git
2. "+" buton → "İlk Portföyüm" yaz
3. Oluştur
```

**3. Fon Al**
```
1. "Ara" → "ABD" ara
2. ABD fonunu bul
3. "Portföye Ekle" bas
4. Lot: 1000
5. Fiyat: 0.025679
6. "İlk Portföyüm" seç
```

**4. Takip Et**
```
1. "Portföy" → Portföyünü aç
2. Kar/zarar görüntüle
3. "Canlı" → Gün içi değişimi izle
```

---

**Başarılar! 🚀📈**
