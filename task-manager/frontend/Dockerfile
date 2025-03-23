FROM node:18-alpine

WORKDIR /app

# Copy package.json and package-lock.json
COPY package.json package-lock.json ./

# Install dependencies with legacy peer deps to resolve conflicts
RUN npm install --legacy-peer-deps

# Install web dependencies
RUN npm install --legacy-peer-deps react-native-web@~0.18.10 react-dom@18.2.0 @expo/webpack-config@^18.0.1

# Copy the rest of the app
COPY . .

# Expose ports used by Expo
EXPOSE 19000 19001 19002 19006

# Set environment for Expo to run in container
ENV REACT_NATIVE_PACKAGER_HOSTNAME="0.0.0.0"
ENV EXPO_DEVTOOLS_LISTEN_ADDRESS="0.0.0.0"

# Start Expo in regular mode (can access via web or native)
CMD ["npm", "start", "--", "--web"] 