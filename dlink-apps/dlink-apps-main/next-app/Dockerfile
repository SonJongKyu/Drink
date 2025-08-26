# 1. Dependencies Layer
FROM node:18-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json ./
# RUN npm ci --production
RUN npm ci 

# 2. Build Layer
FROM node:18-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

# 3. Runner Layer (Production)
FROM node:18-alpine AS runner
WORKDIR /app

# Set environment
# ENV NODE_ENV=production
ENV NODE_ENV=development

# Copy necessary files from builder
COPY --from=builder /app/next.config.js ./next.config.js
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules

# Set port
EXPOSE 3000

# Use non-root user for security
RUN addgroup -S appgroup && adduser -S appuser -G appgroup
USER appuser

# Start the application
CMD ["npm", "start"]
