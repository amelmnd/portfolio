'use client'

import ContentManager from '../../components/AdminDasboard/ContentManager'
import { useAuth } from '../../components/AdminDasboard/AuthProvider'
import Link from 'next/link'
import styles from './Dashboard.module.css'

export default function Dashboard() {
	const { user, signOut } = useAuth()

	if (!user) return <p>Non connecté</p>

	return (
		<div className={styles.container}>
			<h1 className={styles.title}>Dashboard</h1>
			<p className={styles.welcome}>Bienvenue {user.email}</p>
			<button onClick={signOut} className={styles.signOutBtn}>Déconnexion</button>

			<hr className={styles.divider} />

			<nav className={styles.navLinks}>
				<Link href='/dashboard/projects' className={styles.navLink}>
					→ Gérer mes projets
				</Link>
				<Link href='/dashboard/education' className={styles.navLink}>
					→ Gérer les formations
				</Link>
				<Link href='/dashboard/work' className={styles.navLink}>
					→ Gérer les expériences pro
				</Link>
			</nav>
		</div>
	)
}
