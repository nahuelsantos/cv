# CV Website

A modern, responsive CV website built with pure HTML, CSS, and JavaScript. Features dark/light mode, contact form, PDF download, and JSON-driven content.

**🌐 [See it in action](https://cv.nahuelsantos.com)** - Live demo with sample data

## Features

- **Responsive Design** - Works on all devices
- **Dark/Light Mode** - Automatic theme switching
- **PDF Download** - Dynamic filename based on your name
- **Hot Reload** - Update content without rebuilding
- **JSON-Driven** - Easy content management
- **Docker Ready** - Simple deployment
- **Privacy First** - Your data stays private

## 🚀 Quick Start

### For New Users

```bash
# Clone and setup
git clone https://github.com/nahuelsantos/cv.git
cd cv

# Copy templates to create your CV
cp data/cv.template.json data/cv.json
cp data/cv.template.pdf data/cv.pdf

# Edit your information
nano data/cv.json
# Replace data/cv.pdf with your actual resume

# Run locally
make run
# Visit http://localhost:3001
```

### For Development

```bash
git clone https://github.com/nahuelsantos/cv.git
cd cv
make run
# Visit http://localhost:3001 (shows John Doe template)
```

## 📁 File Structure

```
data/
├── cv.template.json     # Sample CV data (copy this)
├── cv.template.pdf      # Sample resume PDF (copy this)
├── cv.json             # Your real CV data (gitignored)
└── cv.pdf              # Your real resume PDF (gitignored)
```

**Everything you need to edit is in the `data/` folder!**

## 📄 PDF Generation

The downloadable PDF is generated from the same content the page renders, at
image build time. There is no second copy of the CV to keep in sync and no
"John Doe" placeholder that can ship by accident:

```bash
# what stage 1 of the Dockerfile runs
python3 scripts/extract_cv_json.py index.html -o data/cv.json    # page  -> data
python3 scripts/generate_cv_pdf.py data/cv.json -o assets/cv.pdf # data  -> PDF
```

`scripts/extract_cv_json.py` reads `index.html` (contact details come from
`humans.txt`) and refuses to emit any string that is not already on the page, so
the extracted data cannot drift from the site or invent content.

`scripts/generate_cv_pdf.py` renders an ATS-friendly PDF: one column, real text
in the standard Helvetica family, conventional section headings ("Experience",
"Education", "Skills"), no tables, text boxes, images or icons, and no page
headers/footers that parsers merge into the content. Every URL is printed as
literal text as well as a link. It then re-reads the finished PDF and checks
that every value reached the text layer, so the build fails instead of shipping
a truncated CV.

To use your own PDF instead, put it at `data/cv.pdf`: nginx serves
`assets/external/cv.pdf` first (`try_files` in `nginx.conf`), so it wins over the
generated one without a rebuild.

## Editing Your CV

### Update Content

Edit `data/cv.json` to change:
- Personal info (name, title, location, summary)
- Work experience and responsibilities
- Skills organized by category
- Projects with descriptions and links
- Education and certifications

### Update Resume PDF

Replace `data/cv.pdf` with your actual resume file.

**That's it!** The website automatically updates when you change these files.

### How the data is loaded

`script.js` fetches `/cv.json` and `/assets/cv.pdf`, which nginx resolves through
the fallback routes in `nginx.conf`: files mounted at `/assets/external` (your
`data/` folder) win, the bundled templates are served otherwise.

`data/cv.template.json` carries `"template": true`. That marker tells `script.js`
to keep the markup shipped in `index.html` instead of rendering placeholder
content over it, so the page never shows "John Doe" — or an error banner — when
your real data is not mounted.

## 🔄 Hot Reload (Server Updates)

Update your live website without rebuilding:

```bash
# Copy your updated files to server
scp data/cv.json user@server:/path/to/cv/data/
scp data/cv.pdf user@server:/path/to/cv/data/

# Changes are live immediately!
```

## Deployment

### Local Development
```bash
make run          # Start with hot reload
make test         # Run validation tests
make stop         # Stop containers
```

### Production
```bash
docker-compose up -d
```

For production with Traefik, uncomment the labels in `docker-compose.yml`.

### Complete Setup with Contact API
For a full setup including the contact API, create this `docker-compose.yml`:

```yaml
services:
  cv:
    build: .
    container_name: cv-website
    restart: unless-stopped
    ports:
      - "3001:80"
    volumes:
      - ./config.json:/usr/share/nginx/html/config.json:ro
      - ./data:/usr/share/nginx/html/assets/external:ro
    depends_on:
      - contact-api

  contact-api:
    image: ghcr.io/nahuelsantos/contact-api:latest
    container_name: contact-api
    restart: unless-stopped
    ports:
      - "3002:3002"
    environment:
      - SMTP_HOST=your-smtp-server
      - SMTP_PORT=587
      - DEFAULT_TO=your-email@domain.com
      - DEFAULT_FROM=noreply@yourdomain.com
```

## Customization

### Styling
Edit CSS variables in `style.css`:
```css
:root {
  --primary: #2d1b69;        /* Brand color */
  --bg-primary: #f0f0f0;     /* Background */
  /* ... more variables */
}
```

### Contact Form

This website integrates with [contact-api](https://github.com/nahuelsantos/contact-api) for handling contact form submissions. 

**Quick Setup with Contact API:**
```bash
# 1. Run the contact API
docker run -d \
  -p 3002:3002 \
  -e SMTP_HOST=your-smtp-server \
  -e DEFAULT_TO=your-email@domain.com \
  ghcr.io/nahuelsantos/contact-api:latest

# 2. Configure your CV website
# Edit config.json to point to your contact API:
```

**Configuration:**
The contact form is configured via `config.json`. Update the `contactApiUrl` to point to your contact API service:

```json
{
    "contactApiUrl": "http://contact-api:3002/api/v1/contact/main"
}
```

For Docker users, the config file is automatically mounted, so you can modify it without rebuilding the container.

**Without Contact API:**
If you don't want to use contact-api, you can set up your own contact endpoint or disable the form by setting `contactApiUrl` to `null`.

## Template System

This project protects your privacy by using templates:

- **Templates** (`cv.template.*`) - Sample data, safe to share publicly
- **Your data** (`cv.json`, `cv.pdf`) - Automatically ignored by git
- **Setup** - Simple copy commands to get started

## Contributing

1. Fork the repository
2. Make your changes
3. Test with `make test`
4. Submit a pull request

## License

MIT License - see [LICENSE](LICENSE) for details.

## Contact

- **Web**: [https://nahuelsantos.com](https://nahuelsantos.com)
- **LinkedIn**: [linkedin.com/in/nahuelsantos](https://linkedin.com/in/nahuelsantos)

---

Built with ❤️ using pure HTML, CSS, and JavaScript