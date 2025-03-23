FROM node:18-alpine

WORKDIR /app

# Copy package.json and package-lock.json first for better caching
COPY package.json package-lock.json ./

# Install dependencies with legacy peer deps flag to handle dependency conflicts
RUN npm install --legacy-peer-deps

# Install required web dependencies using npx expo install as recommended
RUN npx expo install react-native-web@~0.18.10 react-dom@18.2.0 @expo/webpack-config@^18.0.1

# Copy the rest of the application code, including the src/screens directory
COPY . .

# Expose the port the app runs on
EXPOSE 19006

# Set environment variables for React development server
ENV PORT=19006
ENV HOST=0.0.0.0
ENV EXPO_PUBLIC_API_URL=http://localhost:4000/api

# Start the React development server
CMD ["npm", "run", "web"] 