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
      setLoading(true);
      try {
        // Récupère les projets favoris
        const { data: favProjects, error: favError } = await supabase
          .from('projects')
          .select(
            `
            *,
            project_skills:project_skills!project_skills_project_id_fkey (
              skills:skills!project_skills_skill_id_fkey ( name )
            )
          `
          )
          .eq('fav', true)
          .order('date', { ascending: false });

        if (favError) throw favError;

        let allProjects = favProjects || [];

        // Complète si moins de 4 projets
        if (allProjects.length < 4) {
          const { data: otherProjects, error: otherError } = await supabase
            .from('projects')
            .select(
              `
              *,
              project_skills:project_skills!project_skills_project_id_fkey (
                skills:skills!project_skills_skill_id_fkey ( name )
              )
            `
            )
            .eq('fav', false)
            .order('date', { ascending: false })
            .limit(4 - allProjects.length);

          if (otherError) throw otherError;

          allProjects = [...allProjects, ...(otherProjects || [])];
        }

        setProjects(allProjects);
      } catch (error) {
        alert('Erreur lors du chargement des projets : ' + error.message);
      } finally {
        setLoading(false);
      }
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
        Mais ce ne sont pas les seuls. Pour en voir plus, rendez-vous dans{' '}
        <Link href='/projects' className={styles.link}>
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
              key={project.id}
              title={project.title}
              description={project.description}
              imgSrc={project.imglink}
              skills={
                project.project_skills?.map((ps) => ps.skills?.name) || []
              }
              repourl={project.repourl}
              demourl={project.demourl}
            />
          )}
        />
      ) : (
        <div className={styles.grid}>
          {projects.map((project) => (
            <ProjectCard
              key={project.id}
              title={project.title}
              description={project.description}
              imgSrc={project.imglink}
              skills={
                project.project_skills?.map((ps) => ps.skills?.name) || []
              }
              repourl={project.repourl}
              demourl={project.demourl}
            />
          ))}
        </div>
      )}
    </section>
  );
}
