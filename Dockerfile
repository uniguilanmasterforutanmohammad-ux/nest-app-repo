# 1. Build Stage
FROM node:20-alpine AS builder
WORKDIR /usr/src/app

COPY package*.json ./
RUN npm ci

COPY . .

# جنریت پریزما با مقدار موقت
ENV DATABASE_URL="GAPGPTMASKTOKENb7uf3lsl5f5X0X"
RUN npx prisma generate
RUN npm run build

# 2. Production Stage
FROM node:20-alpine
WORKDIR /usr/src/app

COPY package*.json ./
# نصب پکیج‌های پروداکشن
RUN npm ci --only=production

# کپی اسکیما برای جنریت در استیج پروداکشن
COPY prisma ./prisma
ENV DATABASE_URL="GAPGPTMASKTOKENb7uf3lsl5f5X1X"
RUN npx prisma generate

# کپی فایل‌های کامپایل‌شده NestJS از مرحله قبل
COPY --from=builder /usr/src/app/dist ./dist

EXPOSE 3000

CMD ["node", "dist/main.js"]
