'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import ProjectCard from './ProjectCard';
import Carousel from '../Carousel/Carousel';
import styles from './Projects.module.css';
import { supabase } from '../../lib/supabaseClient';
import useMediaQuery from '../../hook/useMediaQuery';

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const isMobile = useMediaQuery('(max-width: 768px)');

  useEffect(() => {
    const fetchProjects = async () => {
      const { data } = await supabase
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

  return (
    <section className={styles.projects} id='projects'>
      <h2 className={styles.title}>Mes projets préférés</h2>
      <p className={styles.subtitle}>
        Voici quelques projets sur lesquels j&apos;ai travaillé, chacun
        d&apos;eux fait partie de mes projets préférés et les plus aboutis.
      </p>
      <p className={styles.subtitle}>
        Mais ce ne sont pas les seuls. Pour en voir plus, rendez-vous dans <Link href='/projects' className={styles.link}>
          mon bac à sable de test
        </Link>
        .
      </p>

      {loading ? (
        <p>Chargement des projets...</p>
      ) : projects.length === 0 ? (
        <p>Aucun projet trouvé.</p>
      ) : isMobile ? (
        <Carousel
          items={projects}
          renderItem={(project) => (
            <ProjectCard
              title={project.title}
              description={project.description}
              imgSrc={project.imgLink}
              skills={[]}
              repoURL={project.repoURL}
              demoURL={project.demoURL}
            />
          )}
        />
      ) : (
        <div className={styles.grid}>
          {projects.map((project, index) => (
            <ProjectCard
              key={index}
              title={project.title}
              description={project.description}
              imgSrc={project.imgLink}
              skills={[]}
              repoURL={project.repoURL}
              demoURL={project.demoURL}
            />
          ))}
        </div>
      )}
    </section>
  );
}
