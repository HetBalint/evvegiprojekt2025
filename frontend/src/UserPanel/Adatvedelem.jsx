import React from 'react';

function Adatvedelem() {
  return (
    <div className="adat-container">
      <h1 className="felirat">Adatvédelmi nyilatkozat</h1>
      <div className="modal-body">
        <section>
          <h2>Bevezetés</h2>
          <p>
            Jelen adatvédelmi nyilatkozat célja, hogy tájékoztatást nyújtson a <strong>CrystalHeaven</strong> webalkalmazás (a továbbiakban: „Szolgáltatás”) felhasználóinak a személyes adatok kezeléséről az Európai Parlament és a Tanács (EU) 2016/679 rendelete (a továbbiakban: „GDPR”) értelmében.
          </p>
          <p>
            Az adatkezelő elkötelezett a felhasználók személyes adatainak védelme mellett, és biztosítja, hogy az adatkezelés a vonatkozó jogszabályoknak és adatbiztonsági követelményeknek megfelelően történik.
          </p>
        </section>

        <section>
          <h2>Az adatkezelő adatai</h2>
          <p><strong>Adatkezelő:</strong> Hetényi Bálint & Kalugyer Kevin</p>
          <p><strong>E-mail cím:</strong> <a href="mailto:info@crystalheaven.com">info@crystalheaven.com</a></p>
          <p><strong>Telefonszám:</strong> +36 1 234 5678</p>
        </section>

        <section>
          <h2>Kezelt adatok köre</h2>
          <ul>
            <li>Teljes név</li>
            <li>E-mail cím</li>
            <li>Telefonszám</li>
            <li>Jelszó (titkosított formában)</li>
          </ul>
        </section>

        <section>
          <h2>Az adatkezelés célja és jogalapja</h2>
          <p>Az adatkezelés célja:</p>
          <ul>
            <li>Felhasználói fiók létrehozása és azonosítása</li>
            <li>Kommunikáció a felhasználóval</li>
            <li>A Szolgáltatás működtetése, karbantartása és fejlesztése</li>
            <li>Jogellenes használat megelőzése és biztonság növelése</li>
          </ul>
          <p>
            Az adatkezelés jogalapja a GDPR 6. cikk (1) bekezdés a) pontja szerinti <strong>hozzájárulás</strong>, illetve b) pontja szerinti <strong>szerződés teljesítése</strong>.
          </p>
        </section>

        <section>
          <h2>Adattárolás időtartama</h2>
          <p>
            A személyes adatokat a felhasználói fiók fennállásáig, illetve az utolsó bejelentkezéstől számított maximum 2 évig tároljuk, kivéve ha a felhasználó korábban törlést kér.
          </p>
        </section>

        <section>
          <h2>Adatbiztonság</h2>
          <p>
            Az adatokat bizalmasan kezeljük, és megfelelő technikai és szervezési intézkedésekkel védjük a jogosulatlan hozzáféréstől, megváltoztatástól, továbbítástól, nyilvánosságra hozataltól vagy törléstől.
          </p>
          <p>
            A jelszavakat kizárólag erős titkosítással (pl. bcrypt) tároljuk, azokhoz sem az adatkezelő, sem harmadik fél nem férhet hozzá.
          </p>
        </section>

        <section>
          <h2>Adattovábbítás</h2>
          <p>
            A személyes adatokat harmadik személynek nem adjuk át, kivéve:
          </p>
          <ul>
            <li>ha azt jogszabály írja elő,</li>
            <li>vagy ha ahhoz a felhasználó előzetesen hozzájárult.</li>
          </ul>
        </section>

        <section>
          <h2>Az érintettek jogai</h2>
          <p>A felhasználó az alábbi jogokkal élhet:</p>
          <ul>
            <li><strong>Hozzáféréshez való jog</strong> – tájékoztatást kérhet az adatkezelésről és a tárolt adatairól.</li>
            <li><strong>Helyesbítéshez való jog</strong> – kérheti a pontatlan adatok javítását.</li>
            <li><strong>Törléshez való jog</strong> – kérheti a személyes adatai törlését („elfeledtetés joga”).</li>
            <li><strong>Adatkezelés korlátozásához való jog</strong> – bizonyos feltételek mellett kérheti az adatkezelés korlátozását.</li>
            <li><strong>Adathordozhatósághoz való jog</strong> – kérheti, hogy adatait strukturált, géppel olvasható formátumban megkapja.</li>
            <li><strong>Tiltakozáshoz való jog</strong> – jogos érdeken alapuló adatkezelés esetén tiltakozhat az adatkezelés ellen.</li>
            <li><strong>Hozzájárulás visszavonásához való jog</strong> – bármikor visszavonhatja hozzájárulását, anélkül, hogy az érintené a korábbi adatkezelés jogszerűségét.</li>
          </ul>
          <p>
            Ezekkel a jogokkal kapcsolatban kérjük, írj a következő e-mail címre:<br />
            <a href="mailto:info@crystalheaven.com">info@crystalheaven.com</a>
          </p>
        </section>

        <section>
          <h2>Panasz benyújtása</h2>
          <p>
            Amennyiben úgy érzed, hogy adatkezelésünk nem felel meg a jogszabályoknak, panasszal élhetsz a Nemzeti Adatvédelmi és Információszabadság Hatóságnál (NAIH):
          </p>
          <ul>
            <li><strong>Weboldal:</strong> <a href="https://www.naih.hu" target="_blank" rel="noopener noreferrer">www.naih.hu</a></li>
            <li><strong>Cím:</strong> 1055 Budapest, Falk Miksa utca 9-11.</li>
            <li><strong>E-mail:</strong> <a href="mailto:ugyfelszolgalat@naih.hu">ugyfelszolgalat@naih.hu</a></li>
            <li><strong>Telefon:</strong> +36 (1) 391-1400</li>
          </ul>
        </section>
      </div>
    </div>
  );
}

export default Adatvedelem;
