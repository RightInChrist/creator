FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# First install core dependencies with legacy-peer-deps
RUN npm install --legacy-peer-deps

# Add required web dependencies with legacy-peer-deps
RUN npm install --legacy-peer-deps react-dom@18.2.0 react-native-web@~0.18.10 @expo/webpack-config@^0.17.0

# Copy the rest of the application
COPY . .

# Make sure ports are exposed
EXPOSE 19000 19001 19002 19006

# Use the web script from package.json with host binding for Docker
CMD ["sh", "-c", "npm run web -- --host=0.0.0.0"] 