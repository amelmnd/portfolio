import Link from 'next/link'
import ProjectCard from './ProjectCard'
import styles from './Projects.module.css'

export default function Projects() {
  const projects = [
    {
      id: 1,
      title: 'Portfolio Personnel',
      url: 'https://amel.dev',
      image: 'publicimgpaisaje.jpg',
      tech: ['React', 'TailwindCSS', 'Framer Motion'],
    },
    {
      id: 2,
      title: 'Application météo',
      url: 'https://weather-app.dev',
      image: 'https://source.unsplash.com/600x400/?weather,app',
      tech: ['React', 'API REST', 'Styled Components'],
    },
    {
      id: 3,
      title: 'Plateforme e-commerce',
      url: 'https://shop-demo.dev',
      image: 'https://source.unsplash.com/600x400/?ecommerce,website',
      tech: ['Next.js', 'Stripe', 'Sanity CMS'],
    },
    {
      id: 4,
      title: 'Dashboard Analytics',
      url: 'https://dashboard-demo.dev',
      image: 'https://source.unsplash.com/600x400/?dashboard,analytics',
      tech: ['Vue.js', 'Chart.js', 'Firebase'],
    },
  ];

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
        {projects.map((project, index) => (
          <ProjectCard
            key={index}
            title='Clone Netflix'
            descripcion='Reproduction du design de Netflix avec React et Firebase.'
            imgSrc='.\img\paisaje.jpg'
            skills={['React', 'Firebase', 'CSS']}
            repoURL='https://github.com/amelmnd/netflix-clone'
            demoURL='https://netflix-clone.vercel.app'
          />
        ))}
      </div>
    </section>
  );
}

