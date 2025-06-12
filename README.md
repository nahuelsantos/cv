# Nahuel Santos - CV Website

A modern, fast, and responsive personal CV website built with pure HTML, CSS, and JavaScript. Zero dependencies, no build process, maximum performance.

## 🚀 Features

- **Lightning Fast**: Pure HTML/CSS/JS with no frameworks or build process
- **Responsive Design**: Mobile-first approach with modern CSS Grid and Flexbox
- **Dark/Light Mode**: Automatic system preference detection + manual toggle
- **Contact Form**: Integrated with backend API for message handling
- **PDF Download**: Customizable CV export with section filtering
- **Hot PDF Updates**: Update CV PDF without rebuilding Docker image
- **SEO Optimized**: robots.txt, humans.txt, structured data, meta tags
- **Accessibility**: WCAG 2.1 AA compliant with keyboard navigation
- **Performance**: Lighthouse 100/100 scores across all metrics
- **Docker Ready**: Simple nginx-based deployment with Traefik support

## 🛠 Technology Stack

- **Frontend**: Pure HTML5, Modern CSS3, Vanilla JavaScript (ES2020)
- **Icons**: HackerNoon Pixel Icon Library
- **Fonts**: System fonts for optimal performance
- **Deployment**: Docker + Nginx + Traefik
- **CI/CD**: GitHub Actions for automated builds and deployment

## 📁 Project Structure

```
├── index.html              # Main HTML file with all content
├── style.css               # Modern CSS with CSS variables and responsive design
├── script.js               # Vanilla JavaScript for interactions
├── robots.txt              # SEO and crawler configuration
├── humans.txt              # Team and technology information
├── manifest.json           # Web app manifest
├── nginx.conf              # Nginx configuration with PDF fallback logic
├── Dockerfile              # Docker container definition
├── docker-compose.yml      # Docker Compose setup with volume mount
├── Makefile                # Development and deployment commands
├── assets/
│   ├── nahuel-santos-cv.pdf # Built-in CV (fallback)
│   └── *.svg               # Optimized SVG icons
└── cv-data/                # External volume for PDF updates (created at runtime)
    └── nahuel-santos-cv.pdf # Updated CV (served if present)
```

## 🚀 Quick Start

### Prerequisites

- Docker and Docker Compose
- Make (optional, for convenience commands)

### Development

```bash
# Clone the repository
git clone https://github.com/nahuelsantos/cv.git
cd cv

# Start development server
make run
# or
docker-compose up --build

# Visit http://localhost:3001
```

### Available Commands

```bash
make help    # Show all available commands
make run     # Build and run locally with live reload
make test    # Run HTML validation and link checking
make start   # Start in detached mode
make stop    # Stop the containers
make clean   # Clean up containers and images
```

## 📄 Updating CV PDF (Without Rebuilding)

The application supports hot PDF updates using Docker volumes. This allows you to update your CV without rebuilding the entire Docker image.

### How It Works

1. **Built-in PDF**: The Docker image contains a fallback PDF at `/usr/share/nginx/html/assets/nahuel-santos-cv.pdf`
2. **External Volume**: The `cv-data/` directory is mounted as a volume
3. **Nginx Logic**: Serves external PDF if present, otherwise falls back to built-in PDF

### Setup

1. **Create the directory** (if it doesn't exist):
   ```bash
   mkdir -p cv-data
   ```

2. **Update your PDF**:
   ```bash
   # Copy your new CV to the volume directory
   cp /path/to/your/new-cv.pdf cv-data/nahuel-santos-cv.pdf
   ```

3. **Verify the update**:
   ```bash
   # Check if the new PDF is being served
   curl -I http://localhost:8003/assets/nahuel-santos-cv.pdf
   ```

### PDF Update Process

```bash
# Example: Update CV with a new version
cp ~/Downloads/nahuel-santos-cv-2024.pdf cv-data/nahuel-santos-cv.pdf

# The new PDF is immediately available at:
# https://nahuelsantos.com/assets/nahuel-santos-cv.pdf
```

### Reverting to Built-in PDF

```bash
# Remove external PDF to use the built-in version
rm cv-data/nahuel-santos-cv.pdf

# Or rename it to keep a backup
mv cv-data/nahuel-santos-cv.pdf cv-data/nahuel-santos-cv.pdf.backup
```

### Volume Configuration

The `docker-compose.yml` includes:
```yaml
volumes:
  # Mount external CV PDF (optional - falls back to container's PDF if not present)
  - ./cv-data:/usr/share/nginx/html/assets/external:ro
```

**Key Points:**
- ✅ **No container restart** needed
- ✅ **Immediate updates** - PDF is live instantly
- ✅ **Safe fallback** - built-in PDF if external is missing
- ✅ **Read-only mount** - container can't modify your files

## 🏗 Architecture Decisions

### Why Pure HTML/CSS/JS?

1. **Performance**: Zero framework overhead, sub-second load times
2. **Simplicity**: No build process, no dependencies to manage
3. **Reliability**: No breaking changes from framework updates
4. **SEO**: Perfect search engine optimization out of the box
5. **Accessibility**: Full control over semantic HTML and ARIA

### Key Features Implementation

- **Theme Toggle**: CSS custom properties with `prefers-color-scheme` + localStorage
- **Contact Form**: Fetch API with proper error handling and validation
- **Responsive Design**: CSS Grid and Flexbox with mobile-first approach
- **Animations**: CSS transitions and Intersection Observer API
- **PDF Updates**: Docker volume mounts with nginx fallback logic

## 🎨 Customization

### Content Updates

All content is in `index.html`. Update the following sections:
- Personal information in the header
- Experience items in the `#experience` section
- Skills in the `#skills` section
- Projects in the `#projects` section
- Education in the `#education` section

### Styling

Modify CSS custom properties in `style.css`:
```css
:root {
  --primary: #2d1b69;        /* Brand color */
  --bg-primary: #f0f0f0;     /* Background */
  --text-primary: #2d1b69;   /* Text color */
  /* ... more variables */
}
```

### Contact Form

Update the API endpoint in `script.js`:
```javascript
const response = await fetch('http://contact-api:3010/contact', {
  // ... configuration
});
```

## 🚢 Deployment

### Docker Deployment

```bash
# Build and run
docker-compose up -d

# With Traefik (production)
# Ensure traefik network exists and update labels in docker-compose.yml
docker-compose up -d
```

### GitHub Actions

The project includes CI/CD workflows:
- **CI**: HTML validation, link checking, CSS/JS syntax validation
- **Deploy**: Automated Docker image builds and registry push

## 📊 Performance

- **Lighthouse Score**: 100/100/100/100 (Performance/Accessibility/Best Practices/SEO)
- **Page Load**: < 1 second on 3G
- **Total Size**: < 50KB (optimized assets, removed unused files)
- **First Contentful Paint**: < 0.5s
- **Time to Interactive**: < 1s

## 🔧 Development

### Local Development

1. Edit files directly (no build process needed)
2. Refresh browser to see changes
3. Use browser dev tools for debugging

### Adding New Sections

1. Add HTML structure to `index.html`
2. Add corresponding styles to `style.css`
3. Add any JavaScript interactions to `script.js`
4. Update navigation links if needed

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly (CI will validate HTML, links, and syntax)
5. Submit a pull request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 📞 Contact

- **Email**: nahuel@nahuelsantos.com
- **LinkedIn**: [linkedin.com/in/nahuelsantos](https://linkedin.com/in/nahuelsantos)
- **GitHub**: [github.com/nahuelsantos](https://github.com/nahuelsantos)

---

Built with ❤️ in Barcelona, Spain
