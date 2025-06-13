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

## 📄 Hot Reloading CV Data (Without Rebuilding)

The application supports hot updates for both PDF and CV content using Docker volumes. This allows you to update your CV and resume data without rebuilding the entire Docker image.

### How It Works

1. **Built-in Files**: The Docker image contains fallback files:
   - PDF: `/usr/share/nginx/html/assets/cv.pdf`
   - JSON: `/usr/share/nginx/html/cv.json`
2. **External Volume**: The `data/` directory is mounted as a volume
3. **Nginx Logic**: Serves external files if present, otherwise falls back to built-in files

### Setup

1. **Create the directory** (if it doesn't exist):
   ```bash
   mkdir -p data
   ```

2. **Update your files**:
   ```bash
   # Copy your new CV PDF to the volume directory
   cp /path/to/your/new-cv.pdf data/cv.pdf
   
   # Copy your updated CV data JSON to the volume directory
   cp /path/to/your/updated-cv.json data/cv.json
   ```

3. **Verify the updates**:
   ```bash
   # Check if the new PDF is being served
   curl -I http://localhost:3001/assets/cv.pdf
   
   # Check if the new JSON is being served
   curl http://localhost:3001/cv.json
   ```

### Update Process

```bash
# Example: Update both CV content and PDF
cp ~/Downloads/nahuel-santos-cv-2024.pdf data/cv.pdf
cp ~/Downloads/updated-cv.json data/cv.json

# Both files are immediately available:
# https://nahuelsantos.com/assets/cv.pdf (downloads as firstname-lastname-cv.pdf)
# https://nahuelsantos.com/cv.json (auto-reloads page content)
```

### Reverting to Built-in Files

```bash
# Remove external files to use the built-in versions
rm data/cv.pdf
rm data/cv.json

# Or rename them to keep backups
mv data/cv.pdf data/cv.pdf.backup
mv data/cv.json data/cv.json.backup
```

### Volume Configuration

The `docker-compose.yml` includes:
```yaml
volumes:
  # Mount external CV data (optional - falls back to container's files if not present)
  - ./data:/usr/share/nginx/html/assets/external:ro
```

**Supported Files:**
- `data/cv.pdf` → `/assets/cv.pdf` (downloads as `firstname-lastname-cv.pdf`)
- `data/cv.json` → `/cv.json`

**Key Points:**
- ✅ **No container restart** needed
- ✅ **Immediate updates** - both PDF and CV content are live instantly
- ✅ **Safe fallback** - built-in files if external are missing
- ✅ **Read-only mount** - container can't modify your files
- ✅ **Cache control** - JSON has no-cache headers for instant updates
- ✅ **Dynamic PDF naming** - Downloads use `firstname-lastname-cv.pdf` format from JSON data

### Dynamic PDF Download

The PDF download feature automatically generates the filename based on the `name` field in your `cv.json`:

```json
{
  "name": "John Smith",
  // ... other data
}
```

**Download behavior:**
- File served from: `/assets/cv.pdf`
- Downloaded as: `john-smith-cv.pdf`
- Fallback: Opens PDF in browser if download fails

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
