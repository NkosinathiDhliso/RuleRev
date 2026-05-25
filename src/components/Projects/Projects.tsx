import React, { useEffect, useRef, useState } from 'react';
import { Card, CardBody, Button } from '../ui';
import { ExternalLink, Github, Eye, Lock } from 'lucide-react';
import { ProjectModal, Project } from './ProjectModal';
import styles from './Projects.module.css';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Array of project data with all projects included
const projects: Project[] = [
  {
    title: 'Adv. Motsusi Professional Website',
    description: 'Built for Trust and Maintainability. Implemented a performant, SEO-friendly site with a clean component architecture to simplify updates and ensure long-term reliability for the firm’s digital presence.',
    image: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&q=80&w=2000',
    technologies: ['React', 'Tailwind CSS', 'Vite', 'SEO'],
    outcomes: [
      'Established a strong professional online identity for Adv. Motsusi.',
      'Improved accessibility for potential clients seeking legal services.',
      'Enhanced search engine visibility through targeted SEO strategies.'
    ],
    links: {
      live: 'https://www.advmotsusi.co.za'
    }
  },
  {
    title: 'RTDynamicBC Website',
    description: 'Architected for Business Continuity. Delivered a responsive, accessible site with a maintainable front-end stack and automated deployments, ensuring consistent uptime and fast edits without regressions.',
    image: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2124&q=80',
    technologies: ['HTML', 'CSS', 'Java'],
    outcomes: [
      'Created a professional online presence',
      'Improved client engagement and accessibility',
      'Enhanced brand visibility'
    ],
    links: {
      live: 'https://rtdynamicbc.co.za'
    }
  },
  {
    title: 'IP Navigator',
    description: 'Architected for Data Integrity and Insight. Implemented secure APIs and robust data models with PostgreSQL, pairing AI inference with traceability and monitoring to deliver reliable, explainable scoring for innovators.',
    image: 'https://images.unsplash.com/photo-1626908013943-df94de54984c?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8d2FyZWhvdXNlfGVufDB8fDB8fHww',
    technologies: ['React', 'Python (Flask/FastAPI)', 'AI/ML (for patentability scoring)', 'PostgreSQL'],
    outcomes: [
      'Provided users with actionable patentability scores for their ideas',
      'Streamlined the initial intellectual property assessment process',
      'Empowered innovators with data-driven insights into patent potential'
    ],
    links: {
      live: 'https://ipnavigator.co.za'
    }
  },
  {
    title: 'THFC Scan Platform',
    description: 'Engineered for Operational Reliability. Designed an end-to-end scanning and tracking system with resilient back-end services, offline-tolerant workflows, and automated deployments to keep logistics running without interruption.',
    image: 'https://images.unsplash.com/photo-1672552226380-486fe900b322?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8d2FyZWhvdXNlfGVufDB8fDB8fHww',
    technologies: ['React', 'Node.js', 'Express.js', 'MongoDB', 'Barcode Scanning APIs'],
    outcomes: [
      'Optimized supply chain efficiency for THFC',
      'Improved inventory accuracy and real-time tracking',
      'Enhanced operational transparency across the supply chain'
    ],
    private: true,
    links: {}
  },
  {
    title: 'Landulani Physiotherapy Website',
    description: 'Built for Performance and Accessibility. Delivered a fast, SEO-optimized site with a maintainable component architecture and CI/CD, ensuring consistent updates with confidence.',
    image: 'https://images.unsplash.com/photo-1622878179314-0b25f2ad50e4?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8cGh5c2lvdGhlcmFweSUyMGNsaW5pY3xlbnwwfHwwfHx8MA%3D%3D',
    technologies: ['React', 'Vite', 'Tailwind CSS', 'SEO'],
    outcomes: [
      'Established a trusted online presence for the physiotherapy clinic.',
      'Improved patient access to information and appointment booking.',
      'Showcased the principal physiotherapist\'s expertise and special interests.'
    ],
    links: {
      live: 'https://www.landulaniphysio.com'
    }
  },
  {
    title: 'SensaAI',
    description: 'Engineered for Verifiable Work Experience. Built an AI-powered simulated workplace platform with adaptive learning pipelines and real-time feedback loops. Leveraged cloud-native services with event-driven patterns to deliver a resilient, scalable environment where users gain their first verifiable work experience through realistic simulations.',
    image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?q=80&w=2832',
    technologies: ['React', 'TypeScript', 'AI/ML', 'Google Cloud', 'Vite'],
    outcomes: [
      'Created an immersive simulated workplace for real-world skill validation',
      'Implemented adaptive AI-driven feedback for personalized learning paths',
      'Delivered verifiable work experience credentials to accelerate career readiness'
    ],
    links: {
      live: 'https://app.sensaai.co.za'
    }
  },
  {
    title: 'ProProfile',
    description: 'Architected for Professional Identity. Designed a sleek, modern professional profile platform with secure authentication via AWS, theme-aware rendering, and a maintainable component architecture. Focused on performance optimization and progressive enhancement to ensure a polished experience across all devices.',
    image: 'https://images.unsplash.com/photo-1611532736597-de2d4265fba3?q=80&w=2874',
    technologies: ['React', 'TypeScript', 'AWS Amplify', 'Vite', 'Inter UI'],
    outcomes: [
      'Empowered professionals with a customizable and polished online identity',
      'Implemented secure, theme-aware user experience with light and dark modes',
      'Streamlined portfolio presentation with an intuitive, modern interface'
    ],
    links: {
      live: 'https://proprofile.co.za'
    }
  },
  {
    title: 'Area Code',
    description: 'Built for Real-Time Discovery. Engineered a location-based venue discovery and rewards platform for South Africa with live status updates, interactive Mapbox maps, and Google OAuth integration. Designed a responsive, mobile-first architecture with structured data and SEO to deliver a seamless experience across Johannesburg, Cape Town, and Durban.',
    image: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=2940',
    technologies: ['React', 'TypeScript', 'Mapbox GL', 'Google OAuth', 'Vite', 'Google Cloud'],
    outcomes: [
      'Delivered real-time venue status tracking across major South African cities',
      'Implemented a gamified check-in and rewards system to drive user engagement',
      'Built a mobile-first, map-centric experience for intuitive venue discovery'
    ],
    links: {
      live: 'https://areacode.co.za'
    }
  },
  {
    title: 'Malumz Movement',
    description: 'Built for Community and Impact. Developed a digital platform for the Malumz Movement centered around "The Dog Trainer" memoir and the Six Trainers framework—a purpose-driven initiative for men rebuilding themselves after apartheid. Delivered a fast, SEO-optimized site with structured data, theme-aware design, and a clean component architecture to amplify the movement\'s reach.',
    image: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?q=80&w=2873',
    technologies: ['React', 'TypeScript', 'SEO', 'Structured Data', 'Responsive Design'],
    outcomes: [
      'Established a compelling digital presence for the Malumz Movement and Brotherhood Circles',
      'Implemented SEO and structured data strategies to maximize discoverability',
      'Delivered a theme-aware, accessible experience across all devices'
    ],
    links: {
      live: 'https://malumz.co.za'
    }
  },
  {
    title: 'KafenFarm',
    description: 'Architected for Agricultural Excellence. Designed and delivered a modern, visually rich web presence for KafenFarm, showcasing the farm\'s produce, story, and values. Focused on performance, accessibility, and a clean UI to connect the farm directly with its community and customers.',
    image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=2832',
    technologies: ['React', 'Vite', 'Tailwind CSS', 'SEO', 'Responsive Design'],
    outcomes: [
      'Created a professional online identity for KafenFarm',
      'Improved customer engagement and visibility for the farm\'s offerings',
      'Delivered a fast, mobile-optimized experience for rural and urban audiences'
    ],
    links: {
      live: 'https://kafenfarm.co.za'
    }
  }
];

export const Projects: React.FC = () => {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const pageRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    if (!pageRef.current) return;

    const ctx = gsap.context(() => {
      const cards = gsap.utils.toArray(`.${styles.projectCard}`);
      gsap.set(cards, { opacity: 0, y: 24 });
      gsap.to(cards, {
        opacity: 1,
        y: 0,
        duration: 0.8,
        stagger: 0.12,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: pageRef.current,
          start: 'top 70%',
        },
      });
    }, pageRef);

    return () => ctx.revert();
  }, []);

  const openModal = (project: Project) => {
    setSelectedProject(project);
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    setSelectedProject(null);
    document.body.style.overflow = 'auto';
  };

  return (
    <div className={styles.projectsPage} ref={pageRef}>
      <div className="container">
        <div className={styles.header}>
          <h1 className={styles.title}>Featured Projects</h1>
          <p className={styles.subtitle}>
            Showcasing innovative solutions that demonstrate expertise in cloud architecture,
            DevOps practices, and digital transformation.
          </p>
        </div>

        <div className={styles.projectsGrid}>
          {projects.map((project, index) => (
            <Card 
              key={project.title} 
              variant="elevated" 
              className={`${styles.projectCard} ${styles[`delay-${index % 3}`]}`}
            >
              <div className={styles.imageContainer}>
                <img
                  src={project.image}
                  alt={`Screenshot of ${project.title}`}
                  className={styles.projectImage}
                  loading="lazy"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.onerror = null;
                    target.src = `https://images.unsplash.com/photo-1517077304055-6e89abbf09b0?q=80&w=800&h=450&fit=crop`;
                  }}
                />
                <div className={styles.imageOverlay} />
                <div className={styles.projectTitle}>
                  <h3>{project.title}</h3>
                </div>
                {project.private && (
                  <span className={styles.privateBadge}>
                    <Lock size={12} />
                    Private
                  </span>
                )}
              </div>
              
              <CardBody className={styles.projectBody}>
                <p className={styles.projectDescription}>
                  {project.description.length > 120 
                    ? `${project.description.substring(0, 120)}...` 
                    : project.description
                  }
                </p>
                
                <div className={styles.techStack}>
                  {project.technologies.slice(0, 3).map((tech, techIndex) => (
                    <span key={techIndex} className={styles.techTag}>
                      {tech}
                    </span>
                  ))}
                  {project.technologies.length > 3 && (
                    <span className={styles.techMore}>
                      +{project.technologies.length - 3} more
                    </span>
                  )}
                </div>
                
                <div className={styles.projectActions}>
                  <Button
                    variant="accent"
                    size="small"
                    onClick={() => openModal(project)}
                    rightIcon={<Eye size={16} />}
                  >
                    View Details
                  </Button>
                  
                  {project.links.live && !project.private && (
                    <Button
                      variant="ghost"
                      size="small"
                      onClick={() => window.open(project.links.live, '_blank')}
                      rightIcon={<ExternalLink size={16} />}
                    >
                      Live Site
                    </Button>
                  )}
                </div>
              </CardBody>
            </Card>
          ))}
        </div>

        {selectedProject && (
          <ProjectModal 
            project={selectedProject} 
            onClose={closeModal} 
          />
        )}
      </div>
    </div>
  );
};