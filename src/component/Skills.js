import React from 'react';
import style from '../styles/Skils.module.css';
import IconLinux from './icon/IconLinux';
import IconApple from './icon/IconApple';
import html from '../asset/images/langage-logo/html5.png';
import css from '../asset/images/langage-logo/css3.png';
import js from '../asset/images/langage-logo/JavaScript.png';
import sass from '../asset/images/langage-logo/Sass.png';
import bootstrap from '../asset/images/langage-logo/bootstrap.png';
import jquery from '../asset/images/langage-logo/jquery.png';

export default function Skills() {
  return (
    <>
      <section id='competence'>
        <h2>Mes Compètence</h2>
        <p>
          Selon moi un dev une fois les bqses acquises peut apprendre tous les
          lqngages. Neanmoins voici une petites listes des langages que je
          connais et avec lesquel je me sens a l'aise{' '}
        </p>
        <div class='competences'>
          <div id='environnemnet'>
            <h3>Mon environnement</h3>
            <ul>
              <div>
                Appel (iOS)
                <IconApple />
              </div>
              <div>
                Linux
                <IconLinux />
              </div>
            </ul>
          </div>
        </div>
        <div>
          <p>Outils</p>
          <div>GitHub</div>
        </div>
        <div class='container'>
          <div class='row' id='skill'>
            <div class='front col-sm-6 col-xs-12 col-12'>
              <p>Frontend</p>
              <img src={html} alt='html5 logo' className={style.logoImg} />
              <img src={css} alt='css3 logo' className={style.logoImg} />
              <img src={js} alt='javascript logo' className={style.logoImg} />
              <img src={sass} alt='sass logo' className={style.logoImg} />
              <img
                src={bootstrap}
                alt='bootstrap logo'
                className={style.logoImg}
              />
              <img src={jquery} alt='sass logo' className={style.logoImg} />
            </div>
            <div class='back col-sm-6 col-xs-12 col-12'>
              <p>Backend</p>
              {/* <img src="img/langage-logo/AJAX.png" alt="Card image cap">
                    <img src="img/langage-logo/php.png" alt="Card image cap">
                    <img src="img/langage-logo/mysql.png" alt="Card image cap">
                    <img src="img/langage-logo/WordPress.png" alt="Card image cap"> */}
            </div>
            <div class='back col-sm-6 col-xs-12 col-12'>
              <p>Autres Langages</p>
              <div>C</div>
              <div>C++</div>
              <div></div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
