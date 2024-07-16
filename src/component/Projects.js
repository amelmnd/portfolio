import React from 'react';

export default function Projects() {
  return (
    <>
      <section id='projets'>
        <h2>Mes Projets</h2>
        <p> </p>
        <div class='colonne'>
          {/* TODO BOUCLE SUR LES DONNEE RECUPERE SOIT DB SOIT FILE */}
          <article id='webagency'>
            <div class='card dark html css'>
              <img
                class='card-img-top'
                // TODO URL ONLINE PICTURE PROJECT
                src='img/projets/siteweb/webagency.png'
                alt=''
              />
              <div class='card-body'>
                <h5 class='card-title'>Web Agency</h5>
                <button
                  type='button'
                  class='btn btn-info'
                  data-toggle='modal'
                  data-target='#webAgency'
                >
                  Détail
                </button>
                <button type='button' class='btn btn-info'>
                  <a
                    href='https://webagency-ocr.amel-mennad.fr/'
                    target='_blank'
                  >
                    Site
                  </a>
                </button>
                {/* <!-- Modal --> DATA DE LA MODAL : */}
                <div
                  class='modal fade'
                  id='webAgency'
                  tabindex='-1'
                  role='dialog'
                  aria-labelledby='webAgencyTitle'
                  aria-hidden='true'
                >
                  <div class='modal-dialog' role='document'>
                    <div class='modal-content'>
                      <div class='modal-header'>
                        <h5 class='modal-title' id='webAgencyTitle'>
                          Web Agency
                        </h5>
                      </div>
                      <div class='modal-body'>
                        <h3>Projet Opendeclic, Openclassrooms</h3>
                        <p>Consignes</p>
                        <p>
                          Vous venez d'être embauché(e) par une agence Web, la
                          WebAgency, qui réalise des sites web pour différents
                          clients. Cependant, ils reconnaissent eux-mêmes que
                          leur site actuel est vieillissant car ils ont peu de
                          temps pour travailler dessus. Certes, il paraît que
                          les cordonniers sont les plus mal chaussés, mais tout
                          de même... On vous propose donc, pour votre première
                          mission, de vous occuper de la refonte du site de
                          l'agence. Le site doit tenir sur une page avec un menu
                          qui reste visible, en haut de la page, meme lorsque
                          l'on se déplace dans la page.
                        </p>
                        <p>
                          Les différentes sections attendues sont :Un premier
                          écran d'accueil de bienvenue, très visuel
                          <ul>
                            <li>La liste des services offerts par l'agence</li>
                            <li>Des exemples de projets déjà réalisés</li>
                            <li>
                              Une carte avec un formulaire de contact (on ne
                              vous demande pas de faire marcher le formulaire,
                              juste de l'afficher).
                            </li>
                            <li>
                              Le site sera réalisé en HTML et CSS (sans
                              framework tel que Bootstrap)
                            </li>
                          </ul>
                        </p>
                        <p>Langages : HTML, CSS</p>
                      </div>
                      <div class='modal-footer'>
                        <button
                          type='button'
                          class='btn btn-secondary'
                          data-dismiss='modal'
                        >
                          Close
                        </button>
                        <button type='button' class='btn btn-info'>
                          <a
                            href='https://webagency-ocr.amel-mennad.fr/'
                            target='_blank'
                          >
                            Site
                          </a>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </article>
        </div>
      </section>
    </>
  );
}
