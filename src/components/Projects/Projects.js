import Link from 'next/link'
import ProjectCard from './ProjectCard'
import styles from './Projects.module.css'

export default function Projects() {
	return (
		<section className={styles.projects} id="projects">
			<h2 className={styles.title}>Mes projets préférers</h2>
			<p className={styles.subtitle}>
				Voici quelques projets sur lesquels j'ai travaillé, chacun d'eux fait partie des mes projets préérer et les plus aboutis.
			</p>
			<p>Mes ce ne sont pas les seuls pour en voir plus il suffit d'aller dans mon <Link href="/projects" className={styles.link}>mon laboratoire</Link>, le lieu où je stocke toutes mes expérimentation, mes tests et mes idées.
			</p>


			<div className={styles.grid}>
				{/* Exemple de projet */}
				<ProjectCard
					title="Projet React"
					descripcion="Une application web moderne construite avec React et Next.js."
					imgSrc="/img/project1.jpg"
					skills={['logos:react', 'logos:nextjs', 'logos:tailwindcss']}
					repoURL="https://github.com/amelmnd/project"
					demoURL="https://project-demo.vercel.app"
					averageBrightness="75"
				/>

				<ProjectCard
					title="Projet React"
					descripcion="Une application web moderne construite avec React et Next.js."
					imgSrc="/img/project2.jpg"
					skills={['logos:react', 'logos:nextjs', 'logos:tailwindcss']}
					repoURL="https://github.com/amelmnd/project"
					demoURL="https://project-demo.vercel.app"
					averageBrightness="75"
				/>

			</div>
		</section>
	)
}

