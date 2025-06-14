FROM nginx:alpine

# Copy website files
COPY index.html style.css script.js manifest.json config.json /usr/share/nginx/html/
COPY data/cv.template.json /usr/share/nginx/html/cv.json
COPY data/cv.template.pdf /usr/share/nginx/html/assets/cv.pdf
COPY assets/ /usr/share/nginx/html/assets/

# Copy static files (favicons, robots.txt, humans.txt)
COPY favicon.ico favicon-16x16.png favicon-32x32.png apple-touch-icon.png /usr/share/nginx/html/
COPY android-chrome-192x192.png android-chrome-512x512.png /usr/share/nginx/html/
COPY robots.txt humans.txt /usr/share/nginx/html/

# Copy nginx configuration
COPY nginx.conf /etc/nginx/nginx.conf

# Expose port 80
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"] 