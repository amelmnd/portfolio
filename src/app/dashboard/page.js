'use client';

import Link from 'next/link';
import { useAuth } from '../../context/AuthProvider';
import styles from './Dashboard.module.css';

export default function Dashboard() {
  const { user, signOut } = useAuth();

  if (!user) {
    return <p>Non connecté</p>;
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Dashboard</h1>
      <p className={styles.welcome}>Bienvenue, {user.email}</p>

      <button onClick={signOut} className={styles.signOutBtn}>
        Déconnexion
      </button>

      <hr className={styles.divider} />

      <nav className={styles.navLinks}>
        <Link href='/dashboard/projects' className={styles.navLink}>
          Projets
        </Link>
        <Link href='/dashboard/education' className={styles.navLink}>
          Éducation
        </Link>
        <Link href='/dashboard/work' className={styles.navLink}>
          Work
        </Link>
      </nav>
    </div>
  );
}
