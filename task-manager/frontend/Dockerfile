FROM node:18-alpine

WORKDIR /app

# Copy package files for dependency installation
COPY package*.json ./

# Install dependencies with legacy-peer-deps to handle version conflicts
RUN npm install --legacy-peer-deps

# Don't copy source code - it'll be mounted via volumes

# Install global utilities if needed
# RUN npm install -g some-global-package

EXPOSE 3000
CMD ["npm", "start"] 