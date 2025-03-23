FROM node:18-alpine

WORKDIR /app

# Copy only package files first
COPY package*.json ./

# Install dependencies 
RUN npm install

# No need to copy source files - they'll be mounted via volumes

EXPOSE 3000
CMD ["npm", "start"] 