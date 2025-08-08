// components/SkillTags.js
import styles from './SkillTags.module.css';

export default function SkillTags({ skills = [] }) {
  if (skills.length === 0) return null;

  return (
    <div className={styles.skills}>
      {skills.map((skill, index) => (
        <span key={index} className={styles.skill}>
          {skill}
        </span>
      ))}
    </div>
  );
}
