# 1. Build Stage
FROM node:22-alpine AS builder

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm ci

COPY . .

# اضافه کردن متغیر موقت برای مرحله prisma generate در بیلد داکر
ENV DATABASE_URL="mysql://dummy:dummy@localhost:3306/dummy"

RUN npm run build

# 2. Production Stage
FROM node:22-alpine AS production

WORKDIR /usr/src/app

ENV NODE_ENV=production

COPY package*.json ./
RUN npm ci --omit=dev

COPY --from=builder /usr/src/app/dist ./dist

EXPOSE 3000

CMD ["node", "dist/main"]
