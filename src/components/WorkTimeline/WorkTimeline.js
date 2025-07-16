'use client';
import React, { useRef } from 'react';
import styles from './WorkTimeline.module.css';
import cvData from '../../assets/cv.json';
import { Icon } from '@iconify/react'; // Assure-toi que Iconify est bien installé

const parseDate = (dateStr) => {
  if (!dateStr) return 'Présent';
  return new Date(dateStr).toLocaleDateString('fr-FR', {
    year: 'numeric',
    month: 'short',
  });
};

const TimelineItem = ({
  title,
  subtitle,
  startDate,
  endDate,
  type,
  location,
}) => (
  <div className={styles.timelineContent}>
    <div className={styles.timelineContentInside}>
      <div className={styles.timelinePeriod}>
        {parseDate(startDate)} – {parseDate(endDate)}
      </div>
      <div className={styles.timielineTitle}>{title}</div>
      <p className={styles.timelineSubtitle}>{subtitle}</p>
      <p className={styles.timelineLocation}>{location}</p>
    </div>
  </div>
);

export default function WorkTimeline() {
  const { work } = cvData;
  const timelineRef = useRef(null);

  const events = work
    .filter((item) => item.active) // Garde uniquement les éléments actifs
    .map((item) => ({ ...item, type: 'Expérience' }))
    .sort((a, b) => new Date(b.startDate) - new Date(a.startDate));

  const scroll = (direction) => {
    if (!timelineRef.current) return;
    timelineRef.current.scrollBy({
      left: direction === 'left' ? -300 : 300,
      behavior: 'smooth',
    });
  };

  return (
    <section className={styles.working} id='working'>
      <h2 className={styles.title}>Expérience</h2>
      <div className={styles.timelineWrapper}>
        <button className={styles.scrollButton} onClick={() => scroll('left')}>
          <Icon icon='mdi:chevron-left' />
        </button>
        <div className={styles.timeline} ref={timelineRef}>
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
        <button className={styles.scrollButton} onClick={() => scroll('right')}>
          <Icon icon='mdi:chevron-right' />
        </button>
      </div>
    </section>
  );
}
