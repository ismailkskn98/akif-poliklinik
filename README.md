# Akif Poliklinik

Akif Poliklinik web sitesi, aynı depo içinde bağımsız çalışan bir Next.js frontend ve Express.js API olarak yapılandırılmıştır.

## Teknoloji

- Frontend: Next.js 16.3.2, App Router, JavaScript/JSX, React 19, Tailwind CSS 4, next-intl, shadcn/ui
- Etkileşim: Motion ve GSAP hazırdır; yalnızca ihtiyaç duyulan bölümlerde kullanılacaktır
- Form: React Hook Form + Zod
- Backend: Node.js, Express.js 5, MySQL (`mysql2/promise`), JWT, i18next
- Diller: `tr`, `en`, `de`, `he`, `fr`, `ar`, `it`, `es`, `zh`

Türkçe varsayılan dildir ve `/` adresinde çalışır. Diğer diller `/en`, `/de`, `/he`, `/fr`, `/ar`, `/it`, `/es`, `/zh` öneklerini kullanır. Arapça ve İbranice sayfalar RTL olarak sunulur.

## Klasörler

```text
akif-poliklinik/
├─ frontend/
│  └─ src/
│     ├─ app/(site)/[locale]/
│     ├─ app/(admin)/admin/
│     ├─ components/site/
│     ├─ components/auth/
│     ├─ i18n/
│     └─ messages/
├─ backend/
│  ├─ app.js
│  ├─ general_helpers/
│  ├─ general_services/
│  └─ akifClinic/v1/
│     ├─ controllers/
│     ├─ routes/
│     ├─ services/
│     ├─ middlewares/
│     ├─ helpers/
│     ├─ models/db.js
│     ├─ locales/
│     └─ sql/
└─ scripts/dev.js
```

## Yerel kurulum

1. Bağımlılıkları kurun:

   ```bash
   npm run install:all
   ```

2. `frontend/.env.example` dosyasını `frontend/.env.development`, `backend/.env.example` dosyasını ise `backend/.env.development` olarak kopyalayın. JWT anahtarını ve MySQL bilgilerini doldurun. Production kurulumu için aynı örnek dosyaları `.env.production` adıyla kopyalayıp gerçek URL ve erişim bilgileriyle güncelleyin.

3. MySQL şemasını çalıştırın:

   ```text
   backend/akifClinic/v1/sql/2026-08-24_initial_schema.sql
   ```

4. İki uygulamayı birlikte başlatın:

   ```bash
   npm run dev
   ```

Varsayılan adresler frontend için `http://localhost:3000`, API için `http://localhost:4000/api/akifclinic/v1` şeklindedir. Portlar ilgili uygulamanın `.env.development` dosyasındaki `PORT` değeriyle değiştirilebilir.

## Başlangıç uçları

- `GET /api/akifclinic/v1/public/health`
- `POST /api/akifclinic/v1/public/contact-requests/create`
- `POST /api/akifclinic/v1/auth/login`
- `GET /api/akifclinic/v1/contact-requests` — Bearer JWT gerekir
- `PATCH /api/akifclinic/v1/contact-requests/:id` — Bearer JWT gerekir

API yanıtları `{ status, message, data }` biçimindedir ve `Accept-Language` başlığını destekler.

## İçerik ve tedavi rotaları

Ana sayfa iletişim odaklı kısa bir akış sunar: doğrudan telefon/form erişimi, adres ve harita. Navigasyondaki `Tedaviler` mega menüsü, işlem-sonrası bilgilendirmelerini Akif Poliklinik altında indekslenebilir iç sayfalarda toplar.

- Türkçe liste: `/tedaviler`
- Türkçe örnek detay: `/tedaviler/botoks`
- İngilizce liste: `/en/treatments`
- Almanca liste: `/de/behandlungen`
- Fransızca liste: `/fr/traitements`
- İtalyanca liste: `/it/trattamenti`
- İspanyolca liste: `/es/tratamientos`

Toplam 15 tedavi, dokuz dilde statik olarak üretilir. Her detay sayfasında özgün görsel, genel işlem-sonrası rehber ve hekim talimatının önceliğini açıklayan tıbbi uyarı bulunur.

Marka/iletişim ayarları `frontend/src/config/site.js`, tedavi rota tanımları `frontend/src/content/treatments.js`, dokuz dilde tedavi içeriği `frontend/src/content/treatmentCopy.js` içinde tutulur. Tedavi kataloğu lansman aşamasında statik ve sürüm kontrollüdür; form talepleri MySQL/API üzerinden yönetilir. Yasal belge sürümleri, yönlendirmeler ve site ayarları için backend şeması ayrılmıştır.

Yetki belgesinin değiştirilmeyen kopyası `frontend/public/documents` altındadır. KVKK metni üretime alınmadan önce veri sorumlusunun eksiksiz ticari unvanı ve iletişim bilgileri doğrulanmalıdır.

## Kontrol komutları

```bash
npm run lint
npm run build
```

React Bits, Eldora UI ve Cult UI birer zorunlu runtime bağımlılığı olarak eklenmedi. İhtiyaç doğan bölümde kaynak bileşen yaklaşımıyla, mevcut tasarım sistemi ve erişilebilirlik kuralları korunarak değerlendirilecektir. Three.js de somut bir 3B ihtiyaç oluşmadan kurulmayacaktır.
