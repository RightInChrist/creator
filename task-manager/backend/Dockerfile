FROM node:16-alpine

WORKDIR /app

# Copy package files for dependency installation
COPY package*.json ./

# Install dependencies
RUN npm install

# Don't copy source code - it'll be mounted via volumes

EXPOSE 5000

CMD ["npm", "start"] 