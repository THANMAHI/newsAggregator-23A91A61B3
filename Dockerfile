# Stage 1: Build the React application
FROM node:22-alpine AS build

WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm ci

# Copy the rest of the application files and build
COPY . .
RUN npm run build

# Stage 2: Serve the application using Nginx
FROM nginx:stable-alpine

# Copy built assets from Stage 1
COPY --from=build /app/dist /usr/share/nginx/html

# Expose port 80 for container internal web serving
EXPOSE 80

# Run nginx
CMD ["nginx", "-g", "daemon off;"]
