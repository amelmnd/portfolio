import styles from './Skills.module.css'

export default function Skills() {
	return (
		<section className={styles.skills} id="skills">
			<h2 className={styles.title}>Compétences</h2>
			<ul className={styles.list}>
				<li>JavaScript / ES6+</li>
				<li>React & Next.js</li>
				<li>CSS / Sass</li>
				<li>Git / GitHub</li>
				<li>Node.js & Express</li>
			</ul>
		</section>
	)
}
