FROM node:18-alpine

WORKDIR /app

# Install serve to host the static files
RUN npm install -g serve

# Expect build folder to be copied from host (built locally)
COPY build /app/build

EXPOSE 3001

# Start the static file server
CMD ["serve", "-s", "build", "-l", "3001"] 