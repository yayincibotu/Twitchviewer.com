# TwitchViewer - Twitch İzleyici Hizmetleri

Twitchviewer, Twitch kanalları için izlenme ve etkileşim arttırmaya yönelik profesyonel bir SaaS uygulamasıdır.

## Özellikler

- 🚀 Yüksek performanslı Node.js ve React tabanlı uygulama
- 🔒 Güvenli kullanıcı kimlik doğrulama sistemi
- 💳 Stripe ile entegre ödeme sistemi
- 📊 Kullanıcı paneli ve admin yönetim arayüzü
- 🔍 SEO optimizasyonları ve metrik izleme
- 🌐 HTTP/2 desteği ile hızlı içerik dağıtımı
- 📱 Tam responsive tasarım

## Kullanım

### Hızlı Başlangıç

```bash
docker run -p 5000:5000 \
  -e DATABASE_URL=your_database_url \
  -e STRIPE_SECRET_KEY=your_stripe_secret \
  -e VITE_STRIPE_PUBLIC_KEY=your_stripe_public_key \
  -e SESSION_SECRET=your_session_secret \
  yourusername/twitchviewer:latest
```

### Docker Compose ile Kullanım

```yaml
version: '3.8'

services:
  twitchviewer:
    image: yourusername/twitchviewer:latest
    ports:
      - "5000:5000"
    environment:
      - DATABASE_URL=your_database_url
      - STRIPE_SECRET_KEY=your_stripe_secret
      - VITE_STRIPE_PUBLIC_KEY=your_stripe_public_key
      - SESSION_SECRET=your_session_secret
```

## Ortam Değişkenleri

| Değişken | Açıklama | Zorunlu |
|----------|----------|---------|
| DATABASE_URL | PostgreSQL veritabanı bağlantı URL'i | Evet |
| STRIPE_SECRET_KEY | Stripe gizli API anahtarı | Evet |
| VITE_STRIPE_PUBLIC_KEY | Stripe açık API anahtarı | Evet |
| SESSION_SECRET | Oturum şifreleme anahtarı | Evet |
| PORT | Uygulama portu (varsayılan: 5000) | Hayır |
| NODE_ENV | Çalışma ortamı (varsayılan: production) | Hayır |

## Gereksinimler

- PostgreSQL veritabanı (harici olarak çalışan)
- Stripe hesabı

## Sürümler

- **latest**: En son kararlı sürüm
- **x.y.z**: Spesifik sürümler

## Lisans

MIT

## Katkıda Bulunma

Katkı yapmak için GitHub repo'muzu ziyaret edin: [GitHub Repo](https://github.com/yourusername/twitchviewer)