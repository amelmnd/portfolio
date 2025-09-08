'use client';

import Image from 'next/image';
import styles from './ProjectView.module.css';
import ImageNotFound from '../../assets/imageNotFound.png'

export default function ProjectView({ project, skills, onEdit, onDelete, education }) {
  return (
    <div className={styles.card}>
      <h3>{project.title || <i>(Sans titre)</i>}</h3>
      <p>{project.description || <i>Pas de description</i>}</p>

      {project.imglink ? (
        <img src={project.imglink} className={styles.image} alt={project.title} />
      ) :                   
        <Image src={ImageNotFound} alt={'image par defaut'} className={styles.image}/>
      }

      <div>
        <strong>Éducation :</strong>{' '}
        {education ? education.institution : <i>Non renseignée</i>}
      </div>

      <div>
        <strong>Favori :</strong> {project.fav ? '⭐ Oui' : 'Non'}
      </div>

      <div className={styles.links}>
        {project.repourl && (
          <a href={project.repourl} target="_blank" rel="noreferrer">
            Code test
          </a>
        )}
        {project.demourl && (
          <a href={project.demourl} target="_blank" rel="noreferrer">
            Démo
          </a>
        )}
      </div>

      <div>
        <strong>Date :</strong>{' '}
        {project.date ? new Date(project.date).toLocaleDateString() : '(non renseignée)'}
      </div>

      <div>
        <strong>Skills :</strong>{' '}
        {skills.length ? skills.map((s) => s.name).join(', ') : <i>Aucune</i>}
      </div>

      <div className={styles.buttons}>
        <button onClick={onEdit}>✏️ Modifier</button>
        <button onClick={onDelete}>🗑️ Supprimer</button>
      </div>
    </div>
  );
}
