# Build-only Dockerfile
FROM node:20

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

RUN npm run build

# The built files will be in /app/dist

