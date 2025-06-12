# Nahuel Santos - CV Website

A modern, fast, and responsive personal CV website built with pure HTML, CSS, and JavaScript. Zero dependencies, no build process, maximum performance.

## 🚀 Features

- **Lightning Fast**: Pure HTML/CSS/JS with no frameworks or build process
- **Responsive Design**: Mobile-first approach with modern CSS Grid and Flexbox
- **Dark/Light Mode**: Automatic system preference detection + manual toggle
- **Contact Form**: Integrated with backend API for message handling
- **PDF Download**: Customizable CV export with section filtering
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
├── pixel-icons.css         # HackerNoon pixel icon font definitions
├── robots.txt              # SEO and crawler configuration
├── humans.txt              # Team and technology information
├── manifest.json           # Web app manifest
├── favicon.svg             # SVG favicon
├── nginx.conf              # Nginx configuration for production
├── Dockerfile              # Docker container definition
├── docker-compose.yml      # Docker Compose setup with Traefik
├── Makefile                # Development and deployment commands
├── assets/
│   └── nahuel-santos-cv.pdf # Downloadable CV
└── fonts/
    ├── hackernoon-pixel-icons.woff
    └── hackernoon-pixel-icons.woff2
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
- **PDF Customization**: Dynamic section hiding with print media queries

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
  --primary: #1976d2;        /* Brand color */
  --bg-primary: #ffffff;     /* Background */
  --text-primary: #2c3e50;   /* Text color */
  /* ... more variables */
}
```

### Contact Form

Update the API endpoint in `script.js`:
```javascript
const response = await fetch('http://your-api:3010/contact', {
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
- **CI**: Lint, test, and build validation
- **Deploy**: Automated Docker image builds and registry push

## 📊 Performance

- **Lighthouse Score**: 100/100/100/100 (Performance/Accessibility/Best Practices/SEO)
- **Page Load**: < 1 second on 3G
- **Total Size**: < 100KB (including fonts and images)
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

### Icon Usage

Using HackerNoon Pixel Icons:
```html
<i class="hn hn-icon-name"></i>
```

Available icons: location-pin, envelope, linkedin, github, code, arrow-left, arrow-right, moon, sun, download, settings

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 📞 Contact

- **Email**: nahuel@nahuelsantos.com
- **LinkedIn**: [linkedin.com/in/nahuelsantos](https://linkedin.com/in/nahuelsantos)
- **GitHub**: [github.com/nahuelsantos](https://github.com/nahuelsantos)

---

Built with ❤️ in Barcelona, Spain
