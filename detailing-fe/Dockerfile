FROM node:18

# Set working directory
WORKDIR /app

# Install dependencies with legacy-peer-deps flag to bypass TypeScript conflict
COPY package*.json ./
RUN npm cache clean --force && npm install --legacy-peer-deps

# Copy the rest of the application code
COPY . .

# Expose the port the app runs on
EXPOSE 3000

# Start the app
CMD ["npm", "start"]