import { 
  Profile, 
  Experience, 
  Skill, 
  Education, 
  Certification 
} from '../types';

export const profile: Profile = {
  name: "Nahuel Santos",
  title: "Software Engineer | Backend & System Architecture",
  location: "Barcelona, Catalonia, Spain",
  contact: {
    linkedin: "linkedin.com/in/nahuelsantos",
    github: "github.com/nahuelsantos",
  },
  summary: "A pragmatic and experienced engineering leader with over 15 years designing, building, and scaling complex software systems. Proven ability to architect robust solutions (.NET, Go, Microservices, AWS), lead technical initiatives across teams, and drive significant improvements in performance, reliability, and developer productivity. Adept at translating ambiguous business needs into concrete technical strategies, mentoring engineers, and fostering collaboration. Excels at tackling large-scale integration challenges, modernizing legacy systems, and taking ownership from concept through production deployment. Seeking a Staff (L6) or Principal (L7) Engineer role to leverage deep technical expertise and leadership to solve impactful problems."
};

export const skills: Skill[] = [
  {
    category: "Core Languages",
    items: ["C# (.NET Core)", "Go", "JavaScript/TypeScript", "(Java exposure)"]
  },
  {
    category: "Frontend",
    items: ["React", "React Native"]
  },
  {
    category: "Backend",
    items: ["ASP.NET (Core, Web API)", "Entity Framework", "gRPC", "REST"]
  },
  {
    category: "Cloud & DevOps",
    items: ["AWS (Lambda, S3, DynamoDB, EC2)", "Kubernetes", "Docker", "Terraform", "Azure DevOps (Pipelines)", "CI/CD", "IIS"]
  },
  {
    category: "Databases",
    items: ["SQL Server (inc. Replication, Perf. Tuning)", "Amazon DynamoDB", "Redis"]
  },
  {
    category: "Observability",
    items: ["Datadog", "Sentry", "Custom Logging/Monitoring Solutions"]
  },
  {
    category: "Concepts",
    items: ["Microservices", "System Design & Architecture", "Distributed Systems", "High Availability", "API Design (REST)", "Event-Driven Systems", "Infrastructure as Code (IaC)", "Multi-Tenancy", "Domain-Driven Design (implied)", "SOLID", "Clean Code/Architecture"]
  },
  {
    category: "Tools",
    items: ["Git", "Piranha CMS (example)"]
  }
];

export const experiences: Experience[] = [
  {
    company: "AilyLabs",
    location: "Barcelona, Spain",
    title: "Senior Software Engineer",
    period: "Oct 2023 – Present",
    responsibilities: [
      "Leading backend development for a multi-tenant AI analytics platform using .NET Core, designing and implementing scalable microservices and core features consumed via a Backend-for-Frontend (BFF) architecture.",
      "Architecting solutions and providing technical guidance across multiple teams and senior engineers, ensuring consistency and quality.",
      "Proactively identifying and addressing performance bottlenecks and architectural limitations in existing services, managing the modernization of legacy components.",
      "Driving improvements in system observability using Datadog and Sentry within AWS.",
      "Contributing to frontend development (React/React Native) and managing multi-tenancy aspects via Piranha CMS."
    ]
  },
  {
    company: "Milestone Systems",
    location: "Barcelona, Spain",
    title: "Senior Software Engineer",
    period: "Oct 2022 – Oct 2023",
    responsibilities: [
      "Designed and developed microservices (Go, .NET, gRPC, REST) enabling integration between the core VMS product and 3rd party analytics tools, empowering external developers.",
      "Operated extensively within a Kubernetes environment, defining deployment strategies and optimizing distributed services for high throughput and reliability.",
      "Mentored two junior developers, guiding their technical growth and contributions.",
      "Contributed to team building as part of the events committee."
    ]
  },
  {
    company: "Xero",
    location: "Auckland, New Zealand]",
    title: "Senior Software Engineer",
    period: "Apr 2021 – Apr 2022",
    responsibilities: [
      "Architected and delivered a mission-critical, microservices-based integration layer (using .NET Core, Go, Lambda, DynamoDB, S3) between Xero's accounting platform and Shopify, automating key financial workflows for numerous customers.",
      "Collaborated closely with multiple Xero teams to ensure seamless end-to-end functionality.",
      "Managed cloud infrastructure via Terraform, promoting Infrastructure as Code practices."
    ]
  },
  {
    company: "Sandfield",
    location: "Auckland, New Zealand",
    title: "Solutions Developer / Lead / Architect",
    period: "Mar 2015 – Apr 2022",
    responsibilities: [
      "Served as the primary technical lead for a leading global logistics provider, managing requirements, design, and development for core systems over 5+ years.",
      "Led development and integration for a core data synchronization service, a high-availability, replicated SQL Server database (millions of records) centralizing data across multiple operational logistics systems (transport, warehousing, freight forwarding).",
      "Architected and implemented performance optimizations for the core data synchronization service, including adding replica nodes (NZ, US, Europe), analyzing execution plans, adding indexes, and implementing custom monitoring/logging. Ensured high availability via transactional replication.",
      "Led development for multi-tenant, multi-lingual customer-facing websites and mobile apps (Android, iOS, Windows Mobile via PhoneGap), managing deployments (IIS, on-prem).",
      "Identified business risk from website scraping and proactively proposed, architected, and led the development of a public Developer Portal with documented REST APIs (.NET Web API 2).",
      "Led a team of 4 developers on a new transport product initiative.",
      "Mentored interns as part of the company's official program."
    ]
  },
  {
    company: "Fiscalgis",
    location: "Buenos Aires, Argentina",
    title: "Senior Software Engineer",
    period: "Aug 2013 – Sep 2014",
    responsibilities: [
      "Led development (team of 5) for a GIS application (web/desktop) for government agencies using .NET Framework and Oracle DB, managing large cadastral datasets.",
      "Successfully designed and implemented an internal time-tracking tool (.NET, EF, SQL Server)."
    ]
  },
  {
    company: "Infomeda",
    location: "Buenos Aires, Argentina",
    title: "Software Engineer / Lead",
    period: "Jun 2010 – Jun 2013",
    responsibilities: [
      "Led a small team (3 developers) focused on integrations for advertising industry clients (.NET Framework, EF, SQL Server).",
      "Successfully developed and delivered a URL shortening product integrating with the Google+ API."
    ]
  },
  {
    company: "Snoop Consulting",
    location: "La Plata, Argentina",
    title: "Junior Software Engineer (Part-Time)",
    period: "Oct 2009 – Jun 2010",
    responsibilities: [
      "Developed features for a financial industry client using Java, Spring, Hibernate, and DB2, gaining exposure to different technology stacks."
    ]
  },
  {
    company: "Softtek",
    location: "La Plata, Argentina",
    title: "Junior Software Engineer / De Facto Lead",
    period: "Oct 2008 – Oct 2009",
    responsibilities: [
      "Rapidly progressed from learning .NET/C#/ASP.NET Web Forms to taking lead responsibility (team of 3) for integrating with SAP via SOAP web services after the senior lead departed.",
      "Engaged directly with the client for requirements gathering for a major refrigeration industry client. Became a key technical referent for the team."
    ]
  }
];

export const education: Education[] = [
  {
    degree: "Master's Degree, Software Engineering",
    institution: "Universidad Nacional de La Plata (UNLP), Argentina",
    period: "2012 – 2014",
    description: "Focused on advanced software design patterns, architectural principles, software quality assurance, and project management methodologies, deepening the theoretical and practical aspects of building complex software systems."
  },
  {
    degree: "Engineering Degree, Systems Information Engineering",
    institution: "Universidad Tecnológica Nacional (UTN), Argentina",
    period: "2005 – 2011",
    description: "Comprehensive 5-year engineering program covering foundational computer science, algorithms, data structures, database management, networking, operating systems, and the full software development lifecycle. Provided a strong analytical and problem-solving base."
  }
];

export const certifications: Certification[] = [
  {
    title: "Deep Learning Specialization",
    issuer: "Coursera (deeplearning.ai)",
    period: "2017 – 2018",
    description: "In-depth specialization covering foundational and advanced neural networks, Convolutional Neural Networks (CNNs), Recurrent Neural Networks (RNNs), model tuning strategies, and practical applications of deep learning."
  },
  {
    title: "Self-Driving Car Engineer Nanodegree",
    issuer: "Udacity",
    period: "2016 – 2017",
    description: "Hands-on program focused on the core components of autonomous vehicle technology, including computer vision, sensor fusion, localization, path planning, and control systems, utilizing relevant ML/DL techniques."
  }
]; 