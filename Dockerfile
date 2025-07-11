FROM node:18-alpine
WORKDIR /app

# 1. copy package manifests
COPY package.json package-lock.json ./

# 2. copy prisma folder early so postinstall can find schema
COPY prisma ./prisma

# 3. install deps (post‑install now succeeds)
RUN npm ci

# 4. copy the rest of the source and build
COPY . .
RUN npx prisma generate --schema=./prisma/schema.prisma   # optional: refresh client
RUN npm run build

EXPOSE 3000
CMD ["npm", "start"]
