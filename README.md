# Nahuel Santos - Personal Resume Website

A modern, responsive personal resume website showcasing my experience as a Software Engineer specializing in Backend & System Architecture. Built with React, TypeScript, and Material UI.

## 🚀 Live Demo

Visit [nahuelsantos.com](https://nahuelsantos.com) to see it in action.

## ✨ Features

- **Responsive Design**: Optimized for desktop, tablet, and mobile devices
- **Modern UI**: Clean, professional interface built with Material UI
- **Contact Form**: Frontend contact form (backend integration ready)
- **Project Showcase**: Interactive project cards with technology tags
- **Professional Experience**: Detailed work history and achievements
- **Skills Section**: Comprehensive technical skills breakdown
- **Fast & Lightweight**: Optimized React build with Docker deployment

## 🛠️ Tech Stack

- React 18 with TypeScript
- Material UI (MUI) for components and styling
- Responsive design with mobile-first approach
- Docker for containerization
- GitHub Actions for CI/CD

## 🏃‍♂️ Quick Start

### Prerequisites
- Docker and Docker Compose
- Make (for convenience commands)
- Node.js 18+ (for local development)

### Run with Docker
```bash
# Start the application
make start

# Stop the application
make stop

# Clean up
make clean
```

### Local Development
```bash
# Run locally without Docker
make run

# Run tests
make test
```

## 📁 Project Structure

```
├── src/                    # React source code
│   ├── components/        # React components
│   ├── data/             # Resume and project data
│   ├── types/            # TypeScript types
│   └── utils/            # API utilities
├── public/               # Static assets
├── .github/workflows/    # CI/CD workflows
├── docker-compose.yml    # Container orchestration
├── Dockerfile           # Docker configuration
└── Makefile             # Development commands
```

## 📧 Contact Form

The contact form is currently a frontend-only component. It's designed to be easily integrated with:
- **Netlify Forms**
- **Formspree**
- **EmailJS** 
- **Custom backend API**

## 🚀 Deployment

### GitHub Container Registry
When you publish a release (e.g., `v1.0.0`), GitHub Actions will automatically:
- Build and test the React app
- Create a Docker image
- Push to `ghcr.io/nahuelsantos/cv:v1.0.0` and `ghcr.io/nahuelsantos/cv:latest`

### Pull and Run
```bash
docker pull ghcr.io/nahuelsantos/cv:latest
docker run -p 3001:3001 ghcr.io/nahuelsantos/cv:latest
```

## 🎨 Customization

This project serves as both my personal website and a template for other developers. Key customization points:

- **Resume Data**: Update `src/data/resumeData.ts` with your information
- **Projects**: Modify `src/data/projectsData.ts` with your projects
- **Styling**: Customize the Material UI theme in `src/theme/`
- **Contact Form**: Add your preferred form handling service

## 📄 License

MIT License - feel free to use this as a template for your own resume website.

---

Built with ❤️ by [Nahuel Santos](https://github.com/nahuelsantos)
