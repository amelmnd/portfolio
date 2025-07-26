'use client';
import React, { useEffect, useState, useRef } from 'react';
import { supabase } from '../../lib/supabaseClient';
import styles from './Timeline.module.css';
import { Icon } from '@iconify/react';

const parseDate = (dateStr) => {
  if (!dateStr) return 'Présent';
  const date = new Date(dateStr);
  return isNaN(date)
    ? dateStr
    : date.toLocaleDateString('fr-FR', { year: 'numeric', month: 'short' });
};

const TimelineItem = ({
  title,
  subtitle,
  startDate,
  endDate,
  location,
  type,
}) => (
  <div className={`${styles.timelineContent} ${styles[type]}`}>
    <div className={styles.timelineContentInside}>
      <div className={styles.timelinePeriod}>
        {parseDate(startDate)} – {parseDate(endDate)}
      </div>
      <div className={styles.timelineTitle}>{title}</div>
      <p className={styles.timelineSubtitle}>{subtitle}</p>
      <p className={styles.timelineLocation}>{location}</p>
    </div>
  </div>
);

export default function Timeline() {
  const [work, setWork] = useState([]);
  const [education, setEducation] = useState([]);
  const timelineRef = useRef(null);

  useEffect(() => {
    async function fetchData() {
      const { data: workData, error: workError } = await supabase.from('work').select('*');
      console.log('workData:', workData);
      console.log('workError:', workError);
      setWork(workData || []);

      const { data: educationData, error: educationError } = await supabase.from('education').select('*');
      console.log('educationData:', educationData);
      console.log('educationError:', educationError);
      setEducation(educationData || []);

    }
    fetchData();
  }, []);

  const workEvents = work
    .filter(item => item.active)
    .map(item => ({
      id: item.id,
      type: 'work',
      title: item.enterpriseName,
      subtitle: item.job,
      endDate: item.endDate || '...',
      location: item.location || '—',
    }));

  const educationEvents = education
    .filter(item => item.active)
    .map(item => ({
      id: item.id,
      type: 'education',
      title: item.studyType,
      subtitle: item.institution,
      endDate: item.endDate || '...',
      location: item.location || '—',
    }));

  const allEvents = [...workEvents, ...educationEvents].sort(
    (a, b) => new Date(b.startDate) - new Date(a.startDate)
  );
  console.log(allEvents)
  const scroll = (direction) => {
    if (!timelineRef.current) return;
    timelineRef.current.scrollBy({
      left: direction === 'left' ? -300 : 300,
      behavior: 'smooth',
    });
  };

  return (
    <section className={styles.working} id='timeline'>
      <h2 className={styles.title}>Mon Parcours</h2>
      <p className={styles.textContent}>
        Mon parcours depuis mon entrer dans le monde du développement je tests
        différents domaine, je decouvre, et suttout j'apprend.
      </p>
      <div className={styles.timelineWrapper}>
        <button className={styles.scrollButton} onClick={() => scroll('left')}>
          <Icon icon='mdi:chevron-left' />
        </button>
        <div className={styles.timeline} ref={timelineRef}>
          {allEvents.map((event, index) => (
            <TimelineItem
              key={index}
              title={event.title}
              subtitle={event.subtitle}
              startDate={event.startDate}
              endDate={event.endDate}
              location={event.location}
              type={event.type}
              skills={event.skills}
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
