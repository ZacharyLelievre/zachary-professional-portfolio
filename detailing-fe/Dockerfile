# Stage 1: Build the React app
FROM node:18 as builder
WORKDIR /app
COPY package*.json ./
RUN npm install --legacy-peer-deps
COPY . .
RUN npm run build

# Stage 2: Serve the production build with Nginx
FROM nginx:alpine
# Remove the default Nginx configuration
RUN rm /etc/nginx/conf.d/default.conf
# Copy your custom Nginx configuration into the container
COPY nginx.conf /etc/nginx/conf.d/
# Copy the build files from the builder stage
COPY --from=builder /app/build /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]