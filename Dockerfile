# Use official Node.js image
FROM node:18

# Set working directory inside the container
WORKDIR /app

# Copy package files first (for caching)
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy remaining files
COPY . .

# Expose port for server
EXPOSE 3000

# Start the app
CMD ["node", "server.js"]
