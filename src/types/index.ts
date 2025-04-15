export interface Experience {
  company: string;
  location?: string;
  title: string;
  period: string;
  responsibilities: string[];
}

export interface Skill {
  category: string;
  items: string[];
}

export interface Education {
  degree: string;
  institution: string;
  period: string;
  description?: string;
}

export interface Certification {
  title: string;
  issuer: string;
  period: string;
  description?: string;
}

export interface Project {
  title: string;
  description: string;
  githubUrl: string;
  technologies?: string[];
  image?: string;
}

export interface Profile {
  name: string;
  title: string;
  location: string;
  contact: {
    phone?: string;
    email?: string;
    linkedin?: string;
    github?: string;
  };
  summary: string;
} 