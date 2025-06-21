'use client';
import React from 'react';
import styles from './WorkTimeline.module.css';
import cvData from '../../assets/cv.json';

const parseDate = (dateStr) => {
  if (!dateStr) return 'Présent';
  return new Date(dateStr).toLocaleDateString('fr-FR', { year: 'numeric', month: 'short' });
};

const TimelineItem = ({ title, subtitle, startDate, endDate, type, location }) => (
  <div className={styles.timelineContent}>
    <div className={styles.timelineContentInside}>
      <div className={styles.timelinePeriod}>
        {parseDate(startDate)} – {parseDate(endDate)}
      </div>
      <div className={styles.timielineTitle}>{title}</div>
      <p>{subtitle}</p>
      <p>{location}</p>
      <small>{type}</small>
    </div>
  </div>
);

export default function WorkTimeline() {
  const { work } = cvData;

  const events = work
    .map(item => ({ ...item, type: 'Expérience' }))
    .sort((a, b) => new Date(b.startDate) - new Date(a.startDate)); // tri du plus récent au plus ancien

  return (
    <section className={styles.working} id="working">
      <h2 className={styles.title}>Expérience</h2>
      <div className={styles.timeline}>
        {events.map((event, index) => (
          <TimelineItem
            key={index}
            title={event.position || event.area}
            subtitle={event.name || event.institution}
            startDate={event.startDate}
            endDate={event.endDate}
            location={event.location || '—'}
            type={event.type}
          />
        ))}
      </div>
    </section >
  );
}
