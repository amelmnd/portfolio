'use client';
import React from 'react';
import styles from './EducationTimeline.module.css';
import cvData from '../../assets/cv.json';

const parseDate = (dateStr) => {
  if (!dateStr) return 'Présent';
  const date = new Date(dateStr);
  if (isNaN(date)) return dateStr; // au cas où ce n'est pas un format date standard
  return date.toLocaleDateString('fr-FR', { year: 'numeric', month: 'short' });
};

export default function EducationTimeline() {
  const { education } = cvData;

  // Trier par date de début décroissante
  const events = education
    .map(item => ({
      ...item,
      startDateFormatted: parseDate(item.startDate),
      endDateFormatted: parseDate(item.endDate),
    }))
    .sort((a, b) => new Date(b.startDate) - new Date(a.startDate));

  return (
    <section className={styles.working} id="working">
      <h2 className={styles.title}>Mon apprentissage</h2>
      <div className={styles.education}>
        {events.map((event, index) => (
          <div key={index} className={styles.educationItem}>
            <div className={styles.itemBlockTitle}>
              <h3>{event.institution}</h3>
              <p>
                {event.startDateFormatted} - {event.endDateFormatted}
              </p>
            </div>
            <p><strong>{event.studyType}</strong> - {event.area}</p>
            {event.summary && <p>{event.summary}</p>}
            {event.courses && event.courses.length > 0 && (
              <p>
                <strong>Cours :</strong> {event.courses.join(', ')}
              </p>
            )}
            {event.skills && event.skills.length > 0 && (
              <p>
                <strong>Compétences :</strong> {event.skills.join(', ')}
              </p>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
