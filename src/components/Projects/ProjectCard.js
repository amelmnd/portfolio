'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import styles from './ProjectCard.module.css';

export default function ProjectCard({
  title,
  description,
  imgSrc,
  skills,
  repoURL,
  demoURL,
}) {
  const [images, setImages] = useState([]);
  console.log(repoURL)
  useEffect(() => {
    const fetchImages = async () => {
      const res = await fetch('/api/cloudinary?folder=apiProjectsPortfolio');
      console.log("cloudinar", data);
      setImages(data);
    };

    fetchImages();
  }, []);

  return (
    <div className={styles.card}>
      <div className={styles.imageContainer}>
        <img src={imgSrc} alt={title} className={styles.image} />
      </div>
      <div className={styles.content}>
        <h3 className={styles.title}>{title}</h3>
        <p className={styles.description}>{description}</p>
        <div className={styles.skills}>
          {skills?.map((skill, index) => (
            <span key={index} className={styles.skill}>
              {skill}
            </span>
          ))}
        </div>
        <div className={styles.links}>
          <Link href={repoURL || ''} target='_blank' className={styles.button}>
            Code
          </Link>
          <Link href={demoURL || ''} target='_blank' className={styles.button}>
            Demo
          </Link>
        </div>
      </div>
    </div>
  );
}
