# Nahuel Santos - Personal Resume Website

A modern, responsive personal resume website showcasing my experience as a Software Engineer specializing in Backend & System Architecture. Built with React, TypeScript, Material UI, and Go.

## 🚀 Live Demo

Visit [nahuelsantos.com](https://nahuelsantos.com) to see it in action.

## ✨ Features

- **Responsive Design**: Optimized for desktop, tablet, and mobile devices
- **Modern UI**: Clean, professional interface built with Material UI
- **Contact Form**: Secure backend contact form powered by Go
- **Project Showcase**: Interactive project cards with technology tags
- **Professional Experience**: Detailed work history and achievements
- **Skills Section**: Comprehensive technical skills breakdown
- **Fast & Lightweight**: Optimized performance with Docker deployment

## 🛠️ Tech Stack

**Frontend:**
- React 18 with TypeScript
- Material UI (MUI) for components and styling
- Responsive design with mobile-first approach

**Backend:**
- Go for API server and contact form handling
- RESTful API design

**Infrastructure:**
- Docker & Docker Compose for containerization
- Traefik for reverse proxy and SSL
- Optimized production builds

## 🏃‍♂️ Quick Start

### Prerequisites
- Docker and Docker Compose
- Make (for convenience commands)

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
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── data/         # Resume and project data
│   │   ├── types/        # TypeScript types
│   │   └── utils/        # API utilities
│   └── public/           # Static assets
├── backend/               # Go API server
│   ├── cmd/api/          # Main application
│   └── internal/         # Internal packages
├── docker-compose.yml     # Container orchestration
└── Makefile              # Development commands
```

## 📧 Contact Form

The contact form is powered by a secure Go backend that handles form submissions. The API validates input and can be configured to send emails or store messages as needed.

## 🎨 Customization

This project serves as both my personal website and a template for other developers. Key customization points:

- **Resume Data**: Update `client/src/data/resumeData.ts` with your information
- **Projects**: Modify `client/src/data/projectsData.ts` with your projects
- **Styling**: Customize the Material UI theme in `client/src/theme/`
- **Contact Form**: Adapt the Go backend for your email/notification preferences

## 📄 License

MIT License - feel free to use this as a template for your own resume website.

---

Built with ❤️ by [Nahuel Santos](https://github.com/nahuelsantos)
