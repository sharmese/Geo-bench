FROM node:20-alpine AS builder
WORKDIR /app

COPY package*.json ./

RUN npm install next@latest react@latest react-dom@latest tailwindcss postcss autoprefixer

COPY . .

RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=development

COPY --from=builder /app/next.config.js ./
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/postcss.config.js ./postcss.config.js
COPY --from=builder /app/tailwind.config.js ./tailwind.config.js

RUN npm install --omit=dev

EXPOSE 3000

CMD ["npm", "run", "dev"]