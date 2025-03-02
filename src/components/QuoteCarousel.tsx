import { useState, useEffect } from 'react';

const quotes = [
  {
    text: "Amel est une personne bienveillante qui n'a pas hésité à me proposer d'être ma mentor pour m'aider dans mon cursus. Durant nos échanges, elle a pris soins de bien me connaître afin de s'adapter à ma personnalité. Amel m'a beaucoup encouragé et motivé durant mon parcours. Cela m'a permis d'affronter les difficultés rencontrées et de me challenger. Grâce à son expérience, elle a su me guider, me corriger pour me permettre d'atteindre mes objectifs avec plus de facilité. Par ses conseils, elle m'a également aidé à résoudre certaines problématiques en autonomie.",
    author: 'Jessica Lecoq',
  },
  {
    text: "Amel est une personne volontaire et passionnée par le métier de développeuse. Nous avons remarqué sa capacité d'adaptation et son investissement lors de travaux techniques sur notre site web en Drupal. Elle osait poser des questions afin de réaliser au mieux les sujets demandés et cela payait. J'ai apprécié cette collaboration et lui souhaite le meilleur pour la suite.",
    author: 'Fanny Besquent-Blandenet',
  },
];

export default function QuoteCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % quotes.length);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <li className='mention-card'>
      <p className='quote'>{quotes[currentIndex].text}</p>
      <p className='author'>{quotes[currentIndex].author}</p>
    </li>
  );
}
