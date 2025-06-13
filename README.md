# CV Website

A modern, responsive CV website built with pure HTML, CSS, and JavaScript. Features dark/light mode, contact form, PDF download, and JSON-driven content.

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
Update the API endpoint in `script.js` if you have a contact service.

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
