'use client';

import { useEffect, useState } from 'react';
import styles from '../styles/Dashboard.module.css';

export default function ProjectList({ onBack }) {
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    fetch('/api/getProjects')
      .then((res) => res.json())
      .then((data) => setProjects(data));
  }, []);

  async function handleDelete(id) {
    await fetch(`/api/deleteProject?id=${id}`, { method: 'DELETE' });
    setProjects((prev) => prev.filter((p) => p.id !== id));
  }

  return (
    <div>
      <button onClick={onBack} className={styles.button}>
        ← Retour
      </button>

      <div className={styles.grid}>
        {projects.length === 0 ? (
          <p>Aucun projet</p>
        ) : (
          projects.map((project) => (
            <div key={project.id} className={styles.card}>
              <h3>{project.title}</h3>
              <p>{project.description}</p>
              {project.imgLink && (
                <img src={project.imgLink} alt='' width={200} />
              )}
              <div className={styles.links}>
                <a
                  href={project.repoURL}
                  target='_blank'
                  rel='noopener noreferrer'
                >
                  Code
                </a>
                <a
                  href={project.demoURL}
                  target='_blank'
                  rel='noopener noreferrer'
                >
                  Demo
                </a>
              </div>
              <button onClick={() => handleDelete(project.id)}>
                🗑️ Supprimer
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
