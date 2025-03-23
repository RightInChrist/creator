FROM node:18-alpine

WORKDIR /app

# No need to copy package files - they'll be mounted via volumes
# Dependencies will be installed on the host and mounted to the container

# Install global utilities if needed
# RUN npm install -g some-global-package

EXPOSE 3000
CMD ["npm", "start"] 