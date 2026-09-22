# 1. Builder Stage
FROM node:20-alpine AS builder
WORKDIR /usr/src/app

COPY package*.json ./
RUN npm ci

COPY . .

# نیاز است که در مرحله بیلد، پریزما جنریت شود
ENV DATABASE_URL="mysql://nest_user:GAPGPTMASKTOKENovlf0guae3dX1X@nest_mysql:3306/nest_db"
RUN npx prisma generate
RUN npm run build

# 2. Production Stage
FROM node:20-alpine
WORKDIR /usr/src/app

COPY --from=builder /usr/src/app/package*.json ./
COPY --from=builder /usr/src/app/node_modules ./node_modules
COPY --from=builder /usr/src/app/dist ./dist
COPY --from=builder /usr/src/app/prisma ./prisma

# جنریت مجدد کلاینت در ایمیج نهایی (برای اطمینان از سازگاری با محیط داکر)
RUN npx prisma generate

EXPOSE 3000
CMD ["node", "dist/main.js"]
