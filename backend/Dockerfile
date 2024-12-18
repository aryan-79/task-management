FROM node:22-alpine
RUN apk add --no-cache openssl
WORKDIR /app
COPY package.json yarn.lock ./
RUN yarn install
COPY . .
EXPOSE 5000
CMD ["sh", "-c", "yarn prisma generate && yarn dev"]