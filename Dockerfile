# Stage 1: build the CV PDF from the page's own content.
#
# index.html is the source of truth (data/cv.template.* is the upstream "John
# Doe" placeholder), so the downloadable PDF is generated here, at build time,
# from the very content the site renders. It therefore cannot drift from the
# page and cannot be the placeholder.
FROM python:3.13-slim AS cvpdf
WORKDIR /build
RUN pip install --no-cache-dir reportlab==5.0.1 pypdf==6.19.0
COPY index.html humans.txt ./
COPY scripts/ scripts/
RUN python3 scripts/extract_cv_json.py index.html -o data/cv.json \
 && python3 scripts/generate_cv_pdf.py data/cv.json -o cv.pdf

# Stage 2: the site itself.
FROM nginx:alpine

# Copy website files
COPY index.html style.css script.js manifest.json config.json /usr/share/nginx/html/
COPY data/cv.template.json /usr/share/nginx/html/cv.json
COPY assets/ /usr/share/nginx/html/assets/

# The generated ATS PDF. An externally mounted assets/external/cv.pdf still
# takes precedence through nginx.conf's try_files, so dropping your own file in
# data/ overrides this one without a rebuild.
COPY --from=cvpdf /build/cv.pdf /usr/share/nginx/html/assets/cv.pdf

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
