FROM node:16-alpine

WORKDIR /app

# No need to copy package files - they'll be mounted via volumes
# Dependencies will be installed on the host and mounted to the container

EXPOSE 5000

CMD ["npm", "start"] 