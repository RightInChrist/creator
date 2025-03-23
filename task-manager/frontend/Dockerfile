FROM node:18-alpine

WORKDIR /app

# Copy the HomeScreen.html file
COPY HomeScreen.html /app/

# Create a directory for the web app
RUN mkdir -p /app/web-build

# Copy the HomeScreen.html to index.html in web-build directory
RUN cp /app/HomeScreen.html /app/web-build/index.html

# Expose port
EXPOSE 19006

# Install a simple HTTP server to serve the static content
RUN npm install -g http-server

# Start the HTTP server
CMD ["http-server", "web-build", "-p", "19006", "--cors", "-a", "0.0.0.0"] 