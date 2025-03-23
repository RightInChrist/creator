FROM node:18-alpine

WORKDIR /app

# Copy package.json and package-lock.json first for better caching
COPY package.json package-lock.json ./

# Install dependencies with legacy peer deps to resolve conflicts
RUN npm install --legacy-peer-deps

# Copy the rest of the application code, including src/screens
COPY . .

# Expose the necessary ports
EXPOSE 19006

# Set environment variables for React development server
ENV PORT=19006
ENV HOST=0.0.0.0
ENV EXPO_PUBLIC_API_URL=http://localhost:4000/api

# Start the React development server
CMD ["npm", "run", "web"] 