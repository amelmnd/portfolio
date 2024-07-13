import React from 'react';

export default function Skills() {
  return (
    <>
      <section id='competence'>
        <h2>Mes Compètence</h2>
        <p>
          Je débute en programmation de ce fait mon catalogue de compétence est
          encore limitée mais je découvre et je m'exerce à de nombreuses choses
          afin de m'améliorer.
        </p>
        <div class='competences'>
          <div id='environnemnet'>
            <h3>Mon environnement</h3>
            <ul>
              <li>GitHub</li>
              <li>Mac</li>
              <li>Windows</li>
            </ul>
          </div>

          <div id='langages'>
            <h3>Langages</h3>
            <div id='progessionbarre'></div>
            <ul>
              <li>HTML 5</li>
              <li>CSS 3</li>
              <li>JavaScript</li>
            </ul>
          </div>

          <div id='logiciel'>
            <h3>Logiciels</h3>
            CMS Wordpress
          </div>

          <div id='initiation'>
            <h3>Initiation</h3>
            <ul>
              <li>Sass</li>
              <li>Bootstrap</li>
            </ul>
          </div>
        </div>
      </section>
    </>
  );
}
