import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import { Link } from '@mui/material';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

export default function Projects() {
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

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
              <div>
                <h5 class='card-title'>Web Agency</h5>
                <Button onClick={handleOpen}>Détail</Button>
                <Button>
                  <Link
                    href='https://webagency-ocr.amel-mennad.fr/'
                    target='_blank'
                  >
                    Site
                  </Link>
                </Button>

                <Modal
                  open={open}
                  onClose={handleClose}
                  aria-labelledby='modal-modal-title'
                  aria-describedby='modal-modal-description'
                >
                  <Box sx={style}>
                    <div class='card-modal'>
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
                                Vous venez d'être embauché(e) par une agence
                                Web, la WebAgency, qui réalise des sites web
                                pour différents clients. Cependant, ils
                                reconnaissent eux-mêmes que leur site actuel est
                                vieillissant car ils ont peu de temps pour
                                travailler dessus. Certes, il paraît que les
                                cordonniers sont les plus mal chaussés, mais
                                tout de même... On vous propose donc, pour votre
                                première mission, de vous occuper de la refonte
                                du site de l'agence. Le site doit tenir sur une
                                page avec un menu qui reste visible, en haut de
                                la page, meme lorsque l'on se déplace dans la
                                page.
                              </p>
                              <p>
                                Les différentes sections attendues sont :Un
                                premier écran d'accueil de bienvenue, très
                                visuel
                                <ul>
                                  <li>
                                    La liste des services offerts par l'agence
                                  </li>
                                  <li>Des exemples de projets déjà réalisés</li>
                                  <li>
                                    Une carte avec un formulaire de contact (on
                                    ne vous demande pas de faire marcher le
                                    formulaire, juste de l'afficher).
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
                  </Box>
                </Modal>
              </div>
            </div>
          </article>
        </div>
      </section>
    </>
  );
}
