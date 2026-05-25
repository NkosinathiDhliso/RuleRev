import React from 'react';
import { Card, CardBody, Button } from '../ui';
import { X, ExternalLink, CheckCircle, Lock } from 'lucide-react';
import styles from './ProjectModal.module.css';

export interface Project {
  title: string;
  description: string;
  image: string;
  technologies: string[];
  outcomes: string[];
  private?: boolean;
  links: {
    live?: string;
    github?: string;
  };
}

interface ProjectModalProps {
  project: Project;
  onClose: () => void;
}

export const ProjectModal: React.FC<ProjectModalProps> = ({ project, onClose }) => {
  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className={styles.modalOverlay} onClick={handleOverlayClick}>
      <Card variant="elevated" className={styles.modal}>
        <CardBody className={styles.modalBody}>
          <button 
            className={styles.closeButton}
            onClick={onClose}
            aria-label="Close modal"
          >
            <X size={24} />
          </button>
          
          <div className={styles.modalHeader}>
            <div className={styles.imageContainer}>
              <img
                src={project.image}
                alt={`Screenshot of ${project.title}`}
                className={styles.modalImage}
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.onerror = null;
                  target.src = `https://images.unsplash.com/photo-1517077304055-6e89abbf09b0?q=80&w=800&h=450&fit=crop`;
                }}
              />
              <div className={styles.imageOverlay} />
            </div>
            
            <div className={styles.headerContent}>
              <h2 className={styles.modalTitle}>{project.title}</h2>
              <p className={styles.modalDescription}>{project.description}</p>
            </div>
          </div>
          
          <div className={styles.modalContent}>
            <div className={styles.section}>
              <h3 className={styles.sectionTitle}>Technologies Used</h3>
              <div className={styles.techGrid}>
                {project.technologies.map((tech, index) => (
                  <span key={index} className={styles.techTag}>
                    {tech}
                  </span>
                ))}
              </div>
            </div>
            
            <div className={styles.section}>
              <h3 className={styles.sectionTitle}>Key Outcomes</h3>
              <ul className={styles.outcomesList}>
                {project.outcomes.map((outcome, index) => (
                  <li key={index} className={styles.outcomeItem}>
                    <CheckCircle size={20} className={styles.outcomeIcon} />
                    <span>{outcome}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          
          <div className={styles.modalActions}>
            {project.private && (
              <span className={styles.privateBadge}>
                <Lock size={16} />
                Private Project
              </span>
            )}
            
            {project.links.live && (
              <Button
                variant="accent"
                onClick={() => window.open(project.links.live, '_blank')}
                rightIcon={<ExternalLink size={20} />}
              >
                View Live Site
              </Button>
            )}
            
            {project.links.github && (
              <Button
                variant="ghost"
                onClick={() => window.open(project.links.github, '_blank')}
                rightIcon={<ExternalLink size={20} />}
              >
                View Code
              </Button>
            )}
          </div>
        </CardBody>
      </Card>
    </div>
  );
};