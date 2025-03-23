FROM node:18-alpine

WORKDIR /app

# Copy package.json and package-lock.json
COPY package.json package-lock.json ./

# Install dependencies with legacy peer deps to resolve conflicts
RUN npm install --legacy-peer-deps

# Copy the rest of the app
COPY . .

# Expose ports used by Expo
EXPOSE 19000 19001 19002 19006

# Set environment for Expo to run in container
ENV REACT_NATIVE_PACKAGER_HOSTNAME="0.0.0.0"
ENV EXPO_DEVTOOLS_LISTEN_ADDRESS="0.0.0.0"

# Start Expo
CMD ["npm", "start", "--", "--host", "0.0.0.0"] 