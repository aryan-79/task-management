FROM node:22-alpine
RUN apk add --no-cache openssl
WORKDIR /app
RUN npm install -g pnpm
COPY package.json pnpm-lock.yaml ./
RUN pnpm install
RUN pnpm add -D @types/cors
COPY . .
EXPOSE 5000
CMD ["sh", "-c", "pnpm prisma generate && pnpm dev"]