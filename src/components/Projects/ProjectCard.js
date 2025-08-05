'use client';

import Link from 'next/link';
import styles from './ProjectCard.module.css';

export default function ProjectCard({
  title,
  description,
  imgSrc,
  skills,
  repourl,
  demourl,
}) {
  return (
    <div className={styles.card}>
      <div className={styles.imageContainer}>
        {imgSrc ? (
          <img src={imgSrc} alt={title} className={styles.image} />
        ) : (
          <div className={styles.imagePlaceholder}>Pas d’image</div>
        )}
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
        {(repourl || demourl) && (
          <div className={styles.links}>
            {repourl && (
              <Link href={repourl} target='_blank' className={styles.button}>
                Code
              </Link>
            )}
            {demourl && (
              <Link href={demourl} target='_blank' className={styles.button}>
                Demo
              </Link>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
