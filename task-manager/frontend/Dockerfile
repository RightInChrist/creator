FROM node:18-alpine

WORKDIR /app

# Copy package.json and package-lock.json
COPY package.json package-lock.json ./

# Install dependencies with legacy peer deps to resolve conflicts
RUN npm install --legacy-peer-deps

# Copy the rest of the app
COPY . .

# Install expo-cli and expo-web dependencies
RUN npm install -g expo-cli
RUN npm install --legacy-peer-deps @expo/webpack-config

# Build the web version
RUN npx expo export:web

# Expose port
EXPOSE 19006
EXPOSE 19000
EXPOSE 19001
EXPOSE 19002

# Start the application for web
CMD ["npx", "expo", "start", "--web", "--host", "0.0.0.0"] 