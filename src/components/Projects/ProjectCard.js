import Link from 'next/link';
import styles from './ProjectCard.module.css';

export default function ProjectCard({
  title,
  descripcion,
  imgSrc,
  skills,
  repoURL,
  demoURL,
}) {
  return (
    <div className={styles.card}>
      <div className={styles.imageContainer}>
        <img src={imgSrc} alt={title} className={styles.image} />
      </div>
      <div className={styles.content}>
        <h3 className={styles.title}>{title}</h3>
        <p className={styles.description}>{descripcion}</p>
        <div className={styles.skills}>
          {skills.map((skill, index) => (
            <span key={index} className={styles.skill}>
              {skill}
            </span>
          ))}
        </div>
        <div className={styles.links}>
          <Link href={repoURL} target='_blank' className={styles.button}>
            Code
          </Link>
          <Link href={demoURL} target='_blank' className={styles.button}>
            Demo
          </Link>
        </div>
      </div>
    </div>
  );
}
