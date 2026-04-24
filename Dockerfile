# Stage 1: Build the application
FROM node:20-alpine AS build

# Set working directory
WORKDIR /app

# Copy package.json and bun.lock / package-lock.json first to leverage Docker cache
COPY package*.json bun.lock* ./

# Install dependencies (using npm since package-lock.json is present)
RUN npm ci

# Copy the rest of the application code
COPY . .

# Build the Vite application
RUN npm run build

# Stage 2: Serve the application with Nginx
FROM nginx:alpine

# Copy the generated build artifacts from the build stage
COPY --from=build /app/dist /usr/share/nginx/html

# Overwrite the default Nginx configuration with our custom one
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Cloud Run defaults to port 8080, which we configured in nginx.conf
EXPOSE 8080

# Start Nginx in the foreground
CMD ["nginx", "-g", "daemon off;"]
