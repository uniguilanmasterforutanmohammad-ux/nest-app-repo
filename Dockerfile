# 1. مرحله بیلد (Builder)
FROM node:22-alpine AS builder
WORKDIR /usr/src/app

COPY package*.json ./
COPY prisma ./prisma/

RUN npm ci

COPY . .

# تولید فایل‌های کلاینت پریزما و سپس کامپایل به dist
RUN npx prisma generate
RUN npm run build

# 2. مرحله پروداکشن (Production)
FROM node:22-alpine AS production
WORKDIR /usr/src/app
ENV NODE_ENV=production

COPY package*.json ./
COPY prisma ./prisma/

# نصب وابستگی‌های اجرایی (بدون DevDependencies)
RUN npm ci --omit=dev

# کپی فایل‌های کامپایل شده و کلاینت تولید شده پریزما
COPY --from=builder /usr/src/app/dist ./dist
COPY --from=builder /usr/src/app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /usr/src/app/node_modules/@prisma ./node_modules/@prisma

EXPOSE 3000
CMD ["node", "dist/main"]
