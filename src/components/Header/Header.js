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

				</div>

				<nav className={styles.nav}>
					<Link href="/" className={styles.link}>
						Accueil
					</Link>
					<Link href="/#skills" className={styles.link}>
						Compétences
					</Link>
					<Link href="/#projects" className={styles.link}>
						Projets
					</Link>
					<Link href="/#working" className={styles.link}>
						Expérience
					</Link>
					<Link href="/#ref" className={styles.link}>
						Références
					</Link>
					<Link href="/#contact" className={styles.link}>
						Contact
					</Link>
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
