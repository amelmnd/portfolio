import React from 'react';

export default function About() {
  return (
    <>
      <section id='apropos'>
        <h1>Amel Mennad, Développeuse Web</h1>
        <h2>A propos de moi</h2>

        <div class='aproposde'>
          <article id='presentation'>
            <h3>Qui suis-je ?</h3>
            <p>
              Après un parcours m’ayant permis de travailler dans de nombreux
              environnements, j’ai décidé de m’engager sur une reconversion
              professionnelle de Développeuse Web.
              <br /> Ainsi je suis actuellement une formation chez
              Openclassrooms tout en recherche un contract en alternance pour
              septembre 2018.{' '}
            </p>
          </article>

          <article id='CV'>
            <h3>Mon parcours</h3>
            {/* <a href="portfolio_elements/doc/cv/CV Développeuse Web Font-end .pdf" target="_blank">
            <img id="imgcv" src="portfolio_elements/images/img_projets/cv_devenformation.png" alt="image de mon cv"> </a> */}

            <a href='#' class='myButton'>
              {' '}
              Télécharger
            </a>
          </article>
        </div>
      </section>
    </>
  );
}
