# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY yarn.lock ./

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Build the app with environment variables
ARG VITE_API_URL
ARG VITE_ADMIN_ID
ARG VITE_TELEGRAM_MODE

ENV VITE_API_URL=$VITE_API_URL
ENV VITE_ADMIN_ID=$VITE_ADMIN_ID
ENV VITE_TELEGRAM_MODE=$VITE_TELEGRAM_MODE

RUN npm run build

# Production stage with nginx
FROM nginx:alpine

# Copy custom nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy built assets from builder
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy healthcheck page
RUN echo "OK" > /usr/share/nginx/html/health

EXPOSE 80

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost/ || exit 1

CMD ["nginx", "-g", "daemon off;"]