# Base image
FROM node:20.11.0

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

ARG MODE=development
ENV NODE_ENV=$MODE

RUN if [ "$MODE" = "production" ]; then \
      if [ -f .env.production ]; then cp .env.production .env; else echo "Warning: .env.production not found"; fi; \
    else \
      if [ -f .env.development ]; then cp .env.development .env; else echo "Warning: .env.development not found"; fi; \
    fi