import { Project } from '../types';

export const projects: Project[] = [
  {
    title: "Personal Resume Website",
    description: "A modern, responsive resume website built with React and Material UI, featuring a secure contact form and professional layout.",
    githubUrl: "https://github.com/yourusername/cv",
    technologies: ["React", "TypeScript", "Material UI", "Express"]
  },
  {
    title: "E-commerce Platform",
    description: "A full-stack e-commerce solution with product catalog, shopping cart, user authentication, and payment processing capabilities.",
    githubUrl: "https://github.com/yourusername/ecommerce",
    technologies: ["Node.js", "Express", "MongoDB", "React"]
  },
  {
    title: "Task Management API",
    description: "RESTful API for managing tasks and projects, supporting user authentication, task assignment, and progress tracking.",
    githubUrl: "https://github.com/yourusername/task-api",
    technologies: [".NET Core", "C#", "Entity Framework", "SQL Server"]
  },
  {
    title: "Real-time Chat Application",
    description: "WebSocket-based chat application supporting private messaging, group chats, and file sharing.",
    githubUrl: "https://github.com/yourusername/real-time-chat",
    technologies: ["Go", "WebSockets", "React", "Redis"]
  }
]; 