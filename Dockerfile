FROM --platform=$BUILDPLATFORM node:20-alpine as builder

WORKDIR /app

# Paket dosyalarını kopyala
COPY package*.json ./

# Bağımlılıkları yükle
RUN npm ci

# Kaynak kodları kopyala
COPY . .

# TypeScript ve diğer bağımlılıklar için derleme yap
RUN npm run build

# Üretim aşaması
FROM --platform=$TARGETPLATFORM node:20-alpine as production

WORKDIR /app

# Temel ortam değişkenleri
ENV HTTP2=true
ENV NODE_ENV=production
ENV PORT=5000

# Uygulamaya özel ortam değişkenleri, bunları build sırasında değil çalışma zamanında sağlayın
# Bu değişkenler için varsayılan değerler (güvenlik uyarısı: production ortamında bu değerleri kullanmayın)
ENV SESSION_SECRET=default_session_secret_replace_at_runtime

# Sadece üretim bağımlılıklarını yükle
COPY package*.json ./
RUN npm ci --omit=dev

# Builder aşamasından derlenen dosyaları kopyala
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/client/public ./client/public

# Logs dizini oluştur
RUN mkdir -p logs && chmod 777 logs

# Uygulama için port
EXPOSE 5000

# Uygulamayı başlat (kapsamlı hata ayıklama ile)
CMD ["sh", "-c", "echo 'Starting TwitchViewer application...' && \
      echo 'Environment: NODE_ENV='$NODE_ENV && \
      echo 'Database URL format check: '$(echo $DATABASE_URL | grep -q 'postgresql://' && echo 'VALID' || echo 'INVALID') && \
      echo 'Session Secret format check: '$([ ${#SESSION_SECRET} -gt 10 ] && echo 'VALID' || echo 'INVALID') && \
      echo 'Stripe keys check: '$([ ${#STRIPE_SECRET_KEY} -gt 10 ] && [ ${#VITE_STRIPE_PUBLIC_KEY} -gt 10 ] && echo 'VALID' || echo 'INVALID or MISSING') && \
      node dist/index.js 2>&1 | tee -a logs/app.log || \
      (echo 'Application crashed with status $?' && cat logs/app.log 2>/dev/null || echo 'No logs found')"]