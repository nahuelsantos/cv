import { Project } from '../types';

export const projects: Project[] = [
  {
    title: "Don't Let Me Die",
    description: "A kind of fancy CLI quiz game where you keep your pet alive by answering questions correctly. Features interactive CLI menus, NPM package distribution, and questions fetched from Open Trivia Database. Built to practice creating NPM packages and interactive command-line interfaces.",
    githubUrl: "https://github.com/nahuelsantos/dont-let-me-die",
    technologies: ["JavaScript", "Node.js", "CLI", "NPM", "Inquirer", "Chalk", "Figlet"]
  },
  {
    title: "Dinky Server",
    description: "A comprehensive self-hosted server setup with monitoring, security, and service management - all through a single interactive script. Features LGTMA stack (Loki, Grafana, Tempo, Metrics, Argus) for complete observability, Traefik for reverse proxy, Pi-hole for DNS, and automated deployment scripts.",
    githubUrl: "https://github.com/nahuelsantos/dinky-server",
    technologies: ["Shell", "Docker", "Grafana", "Prometheus", "Loki", "Tempo", "Traefik", "Go", "Makefile"]
  },
  {
    title: "Argus",
    description: "A LGTM stack validator and tester integrated with the monitoring infrastructure. Provides synthetic testing and validation for the entire observability stack, ensuring reliability and performance of monitoring systems.",
    githubUrl: "https://github.com/nahuelsantos/argus",
    technologies: ["Go", "LGTM Stack", "Monitoring", "Testing", "Observability"]
  },
  {
    title: "Personal Resume Website",
    description: "A modern, responsive resume website built with React and Material UI, featuring a secure contact form, professional layout, and Docker deployment. Showcases professional experience and projects with a clean, mobile-friendly design.",
    githubUrl: "https://github.com/nahuelsantos/cv",
    technologies: ["React", "TypeScript", "Material UI", "Go", "Docker", "Makefile"]
  }
]; 