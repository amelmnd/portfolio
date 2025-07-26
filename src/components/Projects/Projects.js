'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import ProjectCard from './ProjectCard';
import styles from './Projects.module.css';
import { supabase } from '../../lib/supabaseClient';

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      const { data, error } = await supabase.from('projects').select('*');
      console.log('Données Supabase:', data);
      console.log('Erreur Supabase:', error);
      setProjects(data || []);
      setLoading(false);
    };

    fetchProjects();
  }, []);

  return (
    <section className={styles.projects} id='projects'>
      <h2 className={styles.title}>Mes projets préférers</h2>
      <p className={styles.subtitle}>
        Voici quelques projets sur lesquels j'ai travaillé, chacun d'eux fait
        partie des mes projets préérer et les plus aboutis.
      </p>
      <p>
        Mes ce ne sont pas les seuls pour en voir plus il suffit d'aller dans
        mon{' '}
        <Link href='/projects' className={styles.link}>
          mon laboratoire
        </Link>
        , le lieu où je stocke toutes mes expérimentation, mes tests et mes
        idées.
      </p>
      <div className={styles.grid}>
        {loading ? (
          <p>Chargement des projets...</p>
        ) : projects.length === 0 ? (
          <p>Aucun projet trouvé.</p>
        ) : (
          projects?.map((project, index) => {
            console.log(project.date);
            console.log(project.title);
            console.log(project.descripcion);
            console.log(project.repoURL);
            console.log(project.demoURL);
            return (
              <div key={index}>
                <p> {project.title}</p>
              </div>
            );
          })
        )}
      </div>
    </section>
  );
}
