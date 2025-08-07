'use client';
import React, { useState, useEffect } from 'react';
import styles from './Carousel.module.css';

export default function Carousel({
  items,
  interval = 6000,
  renderItem,
  classNames = {},
}) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const next = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % items.length);
  };

  const prev = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? items.length - 1 : prevIndex - 1
    );
  };

  useEffect(() => {
    const timer = setInterval(next, interval);
    return () => clearInterval(timer);
  }, []);

  if (!items || items.length === 0) return null;

  return (
    <div
      className={`${styles.carouselContainer} ${classNames.container || ''}`}
    >
      <button
        className={`${styles.navButton} ${classNames.navButton || ''}`}
        onClick={prev}
      >
        ‹
      </button>
      <div className={`${styles.quoteCard} ${classNames.card || ''}`}>
        {renderItem(items[currentIndex], currentIndex)}
      </div>
      <button
        className={`${styles.navButton} ${classNames.navButton || ''}`}
        onClick={next}
      >
        ›
      </button>
    </div>
  );
}