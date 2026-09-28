# Stage 1: build the page's content blocks and the CV PDF from data/cv.json.
#
# data/cv.json is the single source of truth: index.html and the downloadable
# PDF are both generated from it here, so the image can never serve a page, or a
# PDF, that disagrees with the data file. data/cv.template.* is the upstream
# "John Doe" placeholder and is not used for this site.
FROM python:3.13-slim AS cvpdf
WORKDIR /build
RUN pip install --no-cache-dir reportlab==5.0.1 pypdf==6.19.0
COPY index.html ./
# Explicit destination: `COPY data/cv.json ./` would land at /build/cv.json
# and the RUN below expects data/cv.json.
COPY data/cv.json data/cv.json
COPY scripts/ scripts/
RUN python3 scripts/render_cv_html.py --data data/cv.json --html index.html \
 && python3 scripts/generate_cv_pdf.py data/cv.json -o cv.pdf

# Stage 2: the site itself.
FROM nginx:alpine

# The page's content comes from the generated copy; the chrome (head, nav,
# contact modal, footer) is the committed file's.
COPY --from=cvpdf /build/index.html /usr/share/nginx/html/index.html
COPY style.css script.js manifest.json config.json /usr/share/nginx/html/
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
