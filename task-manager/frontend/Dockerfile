FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies with legacy-peer-deps to handle version conflicts
RUN npm install --legacy-peer-deps

# No need for global installs - use local node_modules from package.json
# No need to copy source files - they'll be mounted via volumes

EXPOSE 3000
CMD ["npm", "start"] 