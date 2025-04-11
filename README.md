
# Crystal Heaven - Ékszerbolt és Admin Panel

**Crystal Heaven** egy online ékszerbolt, amely lehetővé teszi a vásárlók számára, hogy könnyedén vásároljanak különböző ékszereket, míg az adminok számára biztosít egy admin panelt a termékek, rendelések és felhasználók kezelésére.

## Funkciók

### Vásárlói Funkciók:
- **Termékek böngészése**: Vásárlók könnyedén böngészhetnek az elérhető ékszerek között.
- **Kosár és rendeléskezelés**: Vásárlók hozzáadhatják a termékeket a kosarukhoz, majd leadhatják rendelésüket.
- **Felhasználói fiók kezelés**: Vásárlók regisztrálhatnak, bejelentkezhetnek, és módosíthatják adataikat.

### Admin Panel Funkciók:
- **Termékek kezelése**: Adminok hozzáadhatják, módosíthatják vagy törölhetik az ékszereket a kínálatból.
- **Kosár és rendeléskezelés**: Adminok nyomon követhetik és kezelhetik a vásárlók rendeléseit, frissíthetik azok státuszát.
- **Felhasználók kezelése**: Adminok kezelhetik a regisztrált felhasználók adatait, illetve jogosultságokat adhatnak és vonhatnak meg.

## Telepítés

A projekt Docker környezetben futtatható, amely biztosítja a környezetek közötti kompatibilitást és egyszerű telepítést.

### Előfeltételek

- **Docker** és **Docker Compose** illetve adatbázist futtató környezet **Beekeeper Studio** telepítve kell legyen a gépén.

### Projekt elindítása Dockerrel:

1. **A projekt letöltése:**

   Klónozd a projektet a GitHub-ról:

   ```bash
   git clone https://github.com/HetBalint/evvegiprojekt2025.git
   cd evvegiprojekt2025
   ```


2.  **Telepítse a szükséges csomagokat:**

Navigáljon a letöltött mappába és telepítse az összes szükséges csomagot:

```bash
cd evvegiprojekt2025
npm install
```

3.  **Indítsa el Dockerben a projektet:**



```bash
docker compose build
docker compose up
```



4.  **Állítsa be az adatbázist:**

A projekt MySQL adatbázist használ. Készítsen egy új adatbázist **evvegiprojekt2025** néven az adatbázis futtató környezetben és konfigurálja a `config/database.js` fájlt az alábbi módon:
[SQL adatbázis letöltése](./path/to/evvegiprojek2025 (8).sql)


```javascript
import mysql from "mysql2"

const db = mysql.createConnection({
  host: "mysql", 
  user: "root",
  password: "root",
  database: "evvegiprojekt2025",
});

export default db
```

3.  **A webalkalmazás megjelenítése:**

- Ékszerbolt weblapja: [Crystal Heaven Weboldal](http://localhost:3000/home)
- Admin panel weblapja: [Admin Panel Bejelentkezés](http://localhost:3000/admin/login)



### 5. Admin Panel

Az admin panel az adminisztrátorok számára van. Az adminisztrátori jogosultságokhoz az alábbi bejelentkezési információk szükségesek:

- **Felhasználónév**: admin
- **Jelszó**: admin1234

A bejelentkezés után az admin panelen keresztül kezelhetei a termékeket, rendeléseket és felhasználókat.



### 7. Tesztelés

A projekthez tartozó teszteket a következő paranccsal futtathatja:

```bash
cd backend/src/test
npm test
```

## Linkek


- **Dokumentáció**: [Dokumentáció Link](https://github.com/HetBalint/evvegiprojekt2025/blob/main/Projektmunka%20dokument%C3%A1l%C3%A1sa.docx)

## Fejlesztők

- **Fejlesztő**: [Bálint Hetényi](https://github.com/HetBalint)
