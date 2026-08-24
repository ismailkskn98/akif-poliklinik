# Akif Poliklinik API

Backend, bulunduğu ortama göre `.env.development` veya `.env.production` dosyasını kullanır.

## İlk kurulum

```bash
npm install
npm run db:migrate
npm run admin:create
npm run dev
```

`db:migrate` MySQL şemasını ve temel site ayarlarını oluşturur. `admin:create`, ilgili env dosyasındaki `ADMIN_*` değerleriyle yönetici hesabını oluşturur veya günceller.

Production ortamı için karşılık gelen komutlar:

```bash
npm run db:migrate:production
npm run admin:create:production
npm start
```

## E-posta bildirimi

İletişim formu kaydı her durumda önce veritabanına yazılır. SMTP bildirimi için env dosyasında `SMTP_*`, `CONTACT_NOTIFICATION_TO`, `PASSWORD_RESET_TO` ve `FRONTEND_URL` alanlarını doldurup `MAIL_ENABLED=true` yapın. SMTP geçici olarak erişilemezse form kaydı kaybolmaz; hata yalnızca sunucu günlüğüne yazılır.

Admin parola sıfırlama bağlantıları 30 dakika geçerlidir, yalnızca bir kez kullanılabilir ve veritabanında düz token yerine SHA-256 özeti tutulur. Süre `PASSWORD_RESET_EXPIRES_MINUTES` ile değiştirilebilir.

## Yönetilen site ayarları

- Instagram adresi
- Telefon numaraları
- Fiziksel adres
- Yetki belgesi görseli

Diğer sayfa metinleri ve dokuz dildeki çeviriler frontend içinde statik tutulur.
