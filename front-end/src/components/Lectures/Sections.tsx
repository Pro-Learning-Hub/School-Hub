import React, { useState } from 'react';
import { ChevronDown, ChevronRight, BookOpen, Clock, Users } from 'lucide-react';
import { Section } from '../../types/lecture.types';
// @ts-ignore
import LectureEntry from './LectureEntry';
import './Sections.css';

interface SectionsProps {
  sections: Section[];
  isLoading?: boolean;
}

interface SectionItemProps {
  section: Section;
  isOpen: boolean;
  onToggle: () => void;
}

const SectionItem: React.FC<SectionItemProps> = ({ section, isOpen, onToggle }) => {
  const estimatedHours = Math.max(1, Math.floor(section.lectures.length * 1.5));
  const estimatedMinutes = Math.floor(Math.random() * 60);

  return (
    <div className="section-item mb-4">
      <div className="section-header" onClick={onToggle}>
        <div className="section-toggle">
          {isOpen ? (
            <ChevronDown className="toggle-icon" size={20} />
          ) : (
            <ChevronRight className="toggle-icon" size={20} />
          )}
        </div>
        
        <div className="section-info flex-grow-1">
          <div className="d-flex justify-content-between align-items-start">
            <div>
              <h3 className="section-title">{section.title}</h3>
              {section.description && (
                <p className="section-description">{section.description}</p>
              )}
            </div>
            
            <div className="section-meta">
              <div className="meta-item">
                <BookOpen size={16} />
                <span>{section.lectures.length} lectures</span>
              </div>
              {/* <div className="meta-item">
                <Clock size={16} />
                <span>{estimatedHours}h {estimatedMinutes}m</span>
              </div> */}
            </div>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="section-content">
          <div className="lectures-list">
            {section.lectures.length > 0 ? (
              section.lectures.map((lecture) => (
                <div key={lecture.id} className="lecture-item">
                  <LectureEntry {...lecture} />
                </div>
              ))
            ) : (
              <div className="no-lectures">
                <Users className="text-muted" size={32} />
                <p className="text-muted mt-2">No lectures available in this section</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

const Sections: React.FC<SectionsProps> = ({ sections, isLoading = false }) => {
  const [openSections, setOpenSections] = useState<Set<string>>(new Set());

  const toggleSection = (sectionId: string) => {
    setOpenSections(prev => {
      const newSet = new Set(prev);
      if (newSet.has(sectionId)) {
        newSet.delete(sectionId);
      } else {
        newSet.add(sectionId);
      }
      return newSet;
    });
  };

  if (isLoading) {
    return (
      <div className="d-flex justify-content-center py-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading sections...</span>
        </div>
      </div>
    );
  }

  if (!sections || sections.length === 0) {
    return (
      <div className="text-center py-5">
        <BookOpen className="text-muted mb-3" size={64} />
        <h4 className="text-muted">No sections available</h4>
        <p className="text-muted">Course sections will appear here once they are added.</p>
      </div>
    );
  }

  return (
    <div className="sections-container">
      {/* <div className="sections-header mb-4">
        <h2 className="text-primary mb-2">Course Sections</h2>
        <p className="text-muted">
          Expand sections to view lectures. Click on any lecture to start learning.
        </p>
      </div> */}

      <div className="sections-list">
        {sections.map((section) => (
          <SectionItem
            key={section.id}
            section={section}
            isOpen={openSections.has(section.id)}
            onToggle={() => toggleSection(section.id)}
          />
        ))}
      </div>
    </div>
  );
};

export default Sections;
