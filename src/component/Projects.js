import React from 'react';

export default function Projects() {
  return (
    <>
      <section id='projets'>
        <h2>Mes Projets</h2>
        <p> </p>
        <div class='colonne'>
          <article id='webagency'>
            <h3>
              <a href='http://amel-mennad.fr/webagency/'> WebAgency</a>
            </h3>
            <a href='http://amel-mennad.fr/webagency/'>
              {' '}
              <img
                src='portfolio_elements/images/img_projets/projets-pro/webagency.png'
                class='proimg'
                alt='projet webagency'
              />{' '}
            </a>
            {/* <p><span class="fab fa-html5"><span class="fab fa-css3-alt"></span></p>  */}
          </article>
          <article id='travelagency'>
            <h3>
              <a href='http://amel-mennad.fr/travelagency/'> Travel Agency</a>
            </h3>
            <a href='http://amel-mennad.fr/travelagency/'>
              {' '}
              <img
                src='portfolio_elements/images/img_projets/projets-pro/travelagency.png'
                class='proimg'
                alt='projet travelagency'
              />{' '}
            </a>
            {/* <p><span class="fab fa-html5"><span class="fab fa-css3-alt"></span></p>  */}
          </article>
          <article id='otstrasbourg'>
            <h3>
              <a href='https://projetwp-strasbourg.amel-mennad.fr/'>
                {' '}
                Travel Agency
              </a>
            </h3>
            <a href='https://projetwp-strasbourg.amel-mennad.fr/'>
              {' '}
              <img
                src='portfolio_elements/images/img_projets/projets-pro/strasbourg.png'
                class='proimg'
                alt='projet office du tourisme strasbourg'
              />{' '}
            </a>
            {/* <p><span class="fab fa-wordpress-simple"></span></p>  */}
          </article>
        </div>
      </section>
    </>
  );
}
