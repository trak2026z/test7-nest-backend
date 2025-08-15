# -------- Base versions (zmienne) --------
ARG NODE_VERSION=20-alpine

# -------- Builder stage --------
FROM node:${NODE_VERSION} AS builder
WORKDIR /app

# Instaluj zależności wyłącznie na podstawie manifestów
COPY package*.json ./
RUN npm ci

# Skopiuj resztę źródeł i zbuduj
COPY . .
# Jeśli masz testy/linters – możesz dodać tu RUN npm test
RUN npm run build

# -------- Runner stage (lżejszy) --------
FROM node:${NODE_VERSION} AS runner
WORKDIR /app

ENV NODE_ENV=production

# Zainstaluj tylko zależności produkcyjne
COPY package*.json ./
RUN npm ci --omit=dev && npm cache clean --force

# Skopiuj zbudowany kod
COPY --from=builder /app/dist ./dist

# (opcjonalnie) jeżeli używasz plików konfiguracyjnych runtime
# COPY --from=builder /app/nest-cli.json ./nest-cli.json

# Użytkownik nie-root (bezpieczniej)
USER node

EXPOSE 3000
CMD ["node", "dist/main.js"]