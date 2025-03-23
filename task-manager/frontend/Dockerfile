FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# No need for global installs - use local node_modules from package.json
# No need to copy source files - they'll be mounted via volumes

EXPOSE 3000
CMD ["npm", "start"] 