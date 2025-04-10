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

# HTTP/2 desteği
ENV HTTP2=true
ENV NODE_ENV=production

# Sadece üretim bağımlılıklarını yükle
COPY package*.json ./
RUN npm ci --omit=dev

# Builder aşamasından derlenen dosyaları kopyala
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/client/public ./client/public

# Uygulama için port
EXPOSE 5000

# Uygulamayı başlat
CMD ["node", "dist/index.js"]