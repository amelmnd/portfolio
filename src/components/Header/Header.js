'use client';

import { useState, useEffect } from 'react';
import styles from './Header.module.css';
import Link from 'next/link';
import useMediaQuery from '../../hook/useMediaQuery';

export default function Header() {
  const [isDark, setIsDark] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const isMobile = useMediaQuery('(max-width: 768px)');

  useEffect(() => {
    document.body.classList.toggle('dark', isDark);
  }, [isDark]);

  const toggleTheme = () => setIsDark((prev) => !prev);
  const toggleMenu = () => setIsMenuOpen((prev) => !prev);
  const closeMenu = () => setIsMenuOpen(false);

  const links = (
    <>
      <Link href='/' className={styles.link} onClick={closeMenu}>
        Accueil
      </Link>
      <Link href='/#skills' className={styles.link} onClick={closeMenu}>
        Compétences
      </Link>
      <Link href='/#projects' className={styles.link} onClick={closeMenu}>
        Projets
      </Link>
      <Link href='/#working' className={styles.link} onClick={closeMenu}>
        Expérience
      </Link>
      <Link href='/#ref' className={styles.link} onClick={closeMenu}>
        Références
      </Link>
      <Link href='/#contact' className={styles.link} onClick={closeMenu}>
        Contact
      </Link>
    </>
  );

  return (
    <header className={styles.header}>
      <div className={styles.logo}>Logo</div>

      {!isMobile && <nav className={styles.nav}>{links}</nav>}

      <div className={styles.actions}>
        {isMobile && (
          <button
            className={styles.hamburger}
            onClick={toggleMenu}
            aria-label='Menu'
          >
            {isMenuOpen ? '✖' : '☰'}
          </button>
        )} {isMobile && isMenuOpen && (
        <nav className={styles.mobileNav}>{links}</nav>
      )}
        <button
          aria-label='Toggle Dark Mode'
          onClick={toggleTheme}
          className={styles.toggleButton}
        >
          {isDark ? '☀️' : '🌙'}
        </button>

      </div>


    </header>
  );
}
