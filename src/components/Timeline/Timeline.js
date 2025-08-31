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

const TimelineItem = ({ title, subtitle, startDate, endDate, location, studyType, type }) => (
  <div className={`${styles.timelineContent} ${styles[type]}`}>
    <div className={styles.timelineContentInside}>
      <div className={styles.timelinePeriod}>
        {parseDate(startDate)} – {parseDate(endDate)}
      </div>
      <div className={styles.timelineTitle}>{title}</div>
      <p className={styles.timelineSubtitle}>{subtitle}</p>
      <p className={styles.timelineLocation}>{location}</p>
      <p className={styles.timelineTag}>{type}</p>
      {studyType && <p className={styles.timelineTag}>{studyType}</p>}
    </div>
  </div>
);

export default function Timeline() {
  const [work, setWork] = useState([]);
  const [education, setEducation] = useState([]);
  const timelineRef = useRef(null);
  const [isAtStart, setIsAtStart] = useState(true);
  const [isAtEnd, setIsAtEnd] = useState(false);
  const EPS = 2;

  const updateArrowStates = () => {
    const el = timelineRef.current;
    if (!el) return;
    const { scrollLeft, scrollWidth, clientWidth } = el;
    const maxScrollLeft = Math.max(0, scrollWidth - clientWidth);
    setIsAtStart(scrollLeft <= EPS);
    setIsAtEnd(scrollLeft >= maxScrollLeft - EPS || maxScrollLeft <= EPS);
  };

  useEffect(() => {
    async function fetchData() {
      const { data: workData } = await supabase
        .from('work')
        .select('*')
        .eq('active', true);
      setWork(workData || []);

      const { data: educationData } = await supabase
        .from('education')
        .select('*')
        .eq('visibility', true);
      setEducation(educationData || []);
    }
    fetchData();
  }, []);

  useEffect(() => {
    const el = timelineRef.current;
    updateArrowStates();
    const onScroll = () => updateArrowStates();
    const onResize = () => updateArrowStates();
    el?.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onResize);
    return () => {
      el?.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onResize);
    };
  }, [work, education]);

  const workEvents = work.map(item => ({
    ...item,
    type: 'work',
    title: item.enterpriseName,
    subtitle: item.job,
    startDate: item.startDate,
    endDate: item.endDate || '...',
    location: item.location || '—',
  }));

  const educationEvents = education.map(item => ({
    ...item,
    type: 'education',
    title: item.studyType,
    subtitle: item.institution,
    startDate: item.startDate,
    endDate: item.endDate || '...',
    location: item.location || '—',
    studyType: item.studyType,
  }));

  const allEvents = [...workEvents, ...educationEvents].sort(
    (a, b) => new Date(b.startDate) - new Date(a.startDate)
  );

  const scroll = (direction) => {
    const el = timelineRef.current;
    if (!el) return;
    const amount = 300;
    el.scrollBy({
      left: direction === 'left' ? -amount : amount,
      behavior: 'smooth',
    });
  };

  return (
    <section className={styles.working} id="working">
      <div className={styles.text}>
        <h2 className={styles.title}>Mon Parcours</h2>
        <p className={styles.textContent}>
          Mon parcours depuis mon entrée dans le monde du développement. Je teste
          différents domaines, je découvre, et surtout j’apprends.
        </p>
      </div>

      <div className={styles.timelineWrapper}>
        <button
          className={styles.scrollButton}
          onClick={() => scroll('left')}
          disabled={isAtStart}
        >
          <Icon icon="mdi:chevron-left" />
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
              studyType={event.studyType}
              type={event.type}
            />
          ))}
        </div>

        <button
          className={styles.scrollButton}
          onClick={() => scroll('right')}
          disabled={isAtEnd}
        >
          <Icon icon="mdi:chevron-right" />
        </button>
      </div>
    </section>
  );
}
