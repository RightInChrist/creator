FROM node:20-alpine

WORKDIR /usr/src/app

# We don't need to copy anything since we're using volume mapping
# The package.json will be mounted from the host

# Expose port 3000
EXPOSE 3000

# Start the development server
CMD ["npm", "run", "dev"] 