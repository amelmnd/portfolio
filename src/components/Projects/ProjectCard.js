'use client';
import styles from './ProjectCard.module.css';
import { Icon } from '@iconify/react';

export default function ProjectCard({
	title,
	descripcion,
	imgSrc,
	skills,
	repoURL,
	demoURL,
	averageBrightness,
}) {
	return (
		<div className={styles.cardPortfolio}>
			<img
				src={imgSrc}
				alt={title}
				crossOrigin="anonymous"
				height={130}
				width={332}
				loading="lazy"
				data-brightness={averageBrightness}
			/>

			<div className={styles.descripcionContainer}>
				<h2 className={styles.cardTitle}>{title}</h2>
				<div className={styles.descripcion}>
					<p>{descripcion}</p>

					<div className={styles.skills}>
						{skills.map((skill, index) => (
							<Icon key={index} icon={skill} className={styles.iconify} />
						))}
					</div>

					<div className={styles.buttons}>
						<a href={repoURL} target="_blank" rel="noopener noreferrer">
							<span>
								GitHub <Icon icon='simple-icons:github'/>
							</span>
						</a>
						<a href={demoURL} target="_blank" rel="noopener noreferrer">
							<span>
								Demo <Icon icon="quill:link-out" />
							</span>
						</a>
					</div>
				</div>
			</div>
		</div>
	);
}
