# Use the official Node.js image as the base
FROM node:20-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy package files first (lets Docker cache the npm install layer)
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy the rest of the app
COPY . .

# Expose the port the app runs on
EXPOSE 3000

# Start the app
CMD ["node", "app.js"]