FROM nginx:alpine

# Copy website files
COPY index.html style.css script.js /usr/share/nginx/html/
COPY data/cv.json /usr/share/nginx/html/
COPY assets/ /usr/share/nginx/html/assets/

# Copy nginx configuration
COPY nginx.conf /etc/nginx/nginx.conf

# Expose port 80
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"] 