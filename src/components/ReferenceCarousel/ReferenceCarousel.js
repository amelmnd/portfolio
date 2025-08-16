'use client';
import React, { useState } from 'react';
import Carousel from '../Carousel/Carousel';
import styles from './ReferenceCarousel.module.css';

const quotes = [
  {
    text: 'Amel se distingue par sa polyvalence et son sens aigu de l’analyse. Elle ne se limite pas à résoudre une problématique donnée, mais anticipe également les besoins futurs et les évolutions possibles. Cette vision globale, alliée à sa capacité à travailler de manière autonome et en équipe, a grandement contribué à la réussite de ses missions.Je suis convaincu que Amel représente un atout précieux pour toute organisation souhaitant intégrer une collaboratrice motivée, proactive et dotée d’une solide capacité d’adaptation.Je recommande donc vivement sa candidature !',
    author: 'Johan Thomias, Engineering Manager, 2025',
  },
  {
    text: "Amel est une personne bienveillante qui n'a pas hésité à me proposer d'être ma mentor pour m'aider dans mon cursus. Durant nos échanges, elle a pris soins de bien me connaître afin de s'adapter à ma personnalité. Amel m'a beaucoup encouragé et motivé durant mon parcours. Cela m'a permis d'affronter les difficultés rencontrées et de me challenger. Grâce à son expérience, elle a su me guider, me corriger pour me permettre d'atteindre mes objectifs avec plus de facilité. Par ses conseils, elle m'a également aidé à résoudre certaines problématiques en autonomie.",
    author: 'Jessica Lecoq, Mentorés à 42 Nice, 2024',
  },
  {
    text: "Amel est une personne volontaire et passionnée par le métier de développeuse. Nous avons remarqué sa capacité d'adaptation et son investissement lors de travaux techniques sur notre site web en Drupal. Elle osait poser des questions afin de réaliser au mieux les sujets demandés et cela payait. J'ai apprécié cette collaboration et lui souhaite le meilleur pour la suite.",
    author:
      'Fanny Besquent-Blandenet, Responsable projets chez TGV Lyria, 2022',
  },
];

export default function ReferenceCarousel() {
  return (
    <section className={styles.carouselSection} id='ref'>
      <header className={styles.header}>
        <h2 className={styles.title}>Références</h2>
        <p>Ce que mes collègues disent de moi</p>
      </header>

      <Carousel
        items={quotes}
        classNames={{
          container: styles.carouselContainerRef,
          card: styles.quoteCardRef,
          navButton: styles.navButtonRef,
        }}
        renderItem={(quote) => {
          // eslint-disable-next-line react-hooks/rules-of-hooks
          const [expanded, setExpanded] = useState(false);
          const toggle = () => setExpanded((prev) => !prev);

          const isMobile =
            typeof window !== 'undefined' && window.innerWidth <= 768;
          const shortText =
            quote.text.slice(0, 150) + (quote.text.length > 100 ? '…' : '');

          return (
            <article className={styles.articleRef}>
              <blockquote className={styles.quoteText}>
                {isMobile && !expanded ? shortText : quote.text}
              </blockquote>
              {isMobile && quote.text.length > 200 && (
                <div className={styles.mobileToggle}>
                  <button onClick={toggle} className={styles.toggleButton}>
                    {expanded ? 'Réduire' : 'Lire plus…'}
                  </button>
                </div>
              )}
              <footer className={styles.quoteAuthor}>{quote.author}</footer>
            </article>
          );
        }}
      />
    </section>
  );
}
