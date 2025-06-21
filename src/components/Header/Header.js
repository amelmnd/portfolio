'use client'

import { useState, useEffect } from 'react'
import styles from './Header.module.css'
import Link from 'next/link'

export default function Header() {
	const [isDark, setIsDark] = useState(false)

	useEffect(() => {
		if (isDark) {
			document.body.classList.add('dark')
		} else {
			document.body.classList.remove('dark')
		}
	}, [isDark])


	const toggleTheme = () => {
		setIsDark(!isDark)
	}

	return (
		<>

			<header className={styles.header}>
				<div>
					<Link href={"/"}>
						<img src={isDark ? "./img/logos/logoDark.png" : "./img/logos/logoLight.png"} alt="Logo" className={ styles.logo} />
					</Link>
				</div>

				<nav className={styles.nav}>
					<a href="/" className={styles.link}>Accueil</a>
					<a href="#skills" className={styles.link}>Compétences</a>
					<a href="#projects" className={styles.link}>Projets</a>
					<a href="#working" className={styles.link}>Expérience</a>
					<a href="#ref" className={styles.link}>Références</a>
					<a href="#contact" className={styles.link}>Contact</a>
				</nav>

				<button
					aria-label="Toggle Dark Mode"
					onClick={toggleTheme}
					className={styles.toggleButton}
				>
					{isDark ? '☀️' : '🌙'}
				</button>
			</header></>
	)
}
