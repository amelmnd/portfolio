import React, { useState, useEffect } from 'react';

export default function Navbar() {
  const [stickyClass, setStickyClass] = useState('');

  useEffect(() => {
    window.addEventListener('scroll', stickNavbar);
    return () => window.removeEventListener('scroll', stickNavbar);
  }, []);

  const stickNavbar = () => {
    if (window !== undefined) {
      let windowHeight = window.scrollY;
      // window height changed for the demo
      windowHeight > 0 ? setStickyClass('sticky-nav') : setStickyClass('');
    }
  };

  return (
    <>
      <header className={`navbar ${stickyClass}`}>
        <nav>
          <ul id='menu-bar'>
            <li>
              <a href='#apropos'>A propos </a>
            </li>
            {/* <ul>
              <li>
                <a href='#presentation'>Qui suis-Je ?</a>
              </li>
              <li>
                <a href='#CV'>Mon CV</a>
              </li>
            </ul> */}
            <li>
              <a href='#competence'>Mes compétences</a>
              {/* <ul>
                <li>
                  <a href='#environnement'>Environnement de travail</a>
                </li>
                <li>
                  <a href='#langages'>Langages de programmation</a>
                </li>
                <li>
                  <a href='#logiciel'>Logiciels</a>
                </li>
              </ul> */}
            </li>
            <li>
              <a href='#projets'>Mes projets</a>
            </li>

            <li>
              <a href='#contact'>Me contacter </a>
            </li>
          </ul>
        </nav>
      </header>
    </>
  );
}
