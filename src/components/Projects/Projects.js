'use client';

import { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import ProjectCard from './ProjectCard';
import styles from './Projects.module.css';
import { supabase } from '../../lib/supabaseClient';
import { Icon } from '@iconify/react';

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const carouselRef = useRef(null); // 🆕 référence pour le scroll

  useEffect(() => {
    const fetchProjects = async () => {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('fav', true)
        .order('created_at', { ascending: false })
        .limit(4);

      setProjects(data || []);
      setLoading(false);
    };

    fetchProjects();
  }, []);

  const scroll = (direction) => {
    if (!carouselRef.current) return;
    carouselRef.current.scrollBy({
      left: direction === 'left' ? -300 : 300,
      behavior: 'smooth',
    });
  };

  return (
    <section className={styles.projects} id='projects'>
      <h2 className={styles.title}>Mes projets préférés</h2>
      <p className={styles.subtitle}>
        Voici quelques projets sur lesquels j'ai travaillé, chacun d'eux fait
        partie de mes projets préférés et les plus aboutis.
      </p>
      <p>
        Mais ce ne sont pas les seuls. Pour en voir plus, rendez-vous dans
        <Link href='/projects' className={styles.link}>
          mon laboratoire
        </Link>
        , le lieu où je stocke toutes mes expérimentations, tests et idées.
      </p>

      <div className={styles.carouselWrapper}>
        <button className={styles.scrollButton} onClick={() => scroll('left')}>
          <Icon icon='mdi:chevron-left' />
        </button>
        <div className={styles.carousel} ref={carouselRef}>
          {loading ? (
            <p>Chargement des projets...</p>
          ) : projects.length === 0 ? (
            <p>Aucun projet trouvé.</p>
          ) : (
            projects.map((project, index) => (
              <ProjectCard
                key={index}
                title={project.title}
                description={project.description}
                imgSrc={project.imgLink}
                skills={[]}
                repoURL={project.repoURL}
                demoURL={project.demoURL}
              />
            ))
          )}
        </div>
        <button className={styles.scrollButton} onClick={() => scroll('right')}>
          <Icon icon='mdi:chevron-right' />
        </button>
      </div>
    </section>
  );
}
