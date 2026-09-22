# 1. Build Stage
FROM node:20-alpine AS builder
WORKDIR /usr/src/app

COPY package*.json ./
RUN npm ci

COPY . .


RUN npm run build

# 2. Production Stage
FROM node:20-alpine
WORKDIR /usr/src/app

COPY package*.json ./
# نصب پکیج‌های پروداکشن
RUN npm ci --only=production



# کپی فایل‌های کامپایل‌شده NestJS از مرحله قبل
COPY --from=builder /usr/src/app/dist ./dist

EXPOSE 3000

CMD ["node", "dist/main.js"]
