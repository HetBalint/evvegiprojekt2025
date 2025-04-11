-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Gép: 127.0.0.1
-- Létrehozás ideje: 2025. Ápr 11. 00:25
-- Kiszolgáló verziója: 10.4.32-MariaDB
-- PHP verzió: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Adatbázis: `evvegiprojekt2025`
--

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `admin`
--

CREATE TABLE `admin` (
  `id` int(11) NOT NULL,
  `nev` varchar(50) NOT NULL,
  `email` varchar(50) NOT NULL,
  `jelszo` varchar(255) NOT NULL,
  `szulev` date DEFAULT NULL,
  `lakhely` varchar(50) NOT NULL,
  `cim` varchar(50) NOT NULL,
  `adoszam` varchar(10) NOT NULL,
  `telszam` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- A tábla adatainak kiíratása `admin`
--

INSERT INTO `admin` (`id`, `nev`, `email`, `jelszo`, `szulev`, `lakhely`, `cim`, `adoszam`, `telszam`) VALUES
(68, 'Hetényi Bálint', 'hetenyibalint06@gmail.com', '$2b$12$yPAxBMdZ7PgcLAn1Buh8DuYzMhb.WH7dEnjc5cSN7WO4u3NNFHvm6', '2006-02-03', 'Keszthely', 'Sági János u. 38', '1122222', '06303057987'),
(70, 'admin', 'admin@gmail.com', '$2b$12$DP2TWffRs1/zp1M9t7x17OCjOILMDicfGlJJOgBFt2fzUlyRxj92q', '2000-02-02', 'Keszthely', 'Admin utca 13', '12345678', '06301234567');

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `kategoria`
--

CREATE TABLE `kategoria` (
  `nev` varchar(255) NOT NULL,
  `id` int(25) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- A tábla adatainak kiíratása `kategoria`
--

INSERT INTO `kategoria` (`nev`, `id`) VALUES
('gyűrű', 1),
('nyaklánc', 2),
('karlánc', 3),
('fülbevaló', 4);

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `kosar`
--

CREATE TABLE `kosar` (
  `id` int(11) NOT NULL,
  `termekID` int(255) NOT NULL,
  `termekNev` varchar(255) NOT NULL,
  `termekMeret` int(25) NOT NULL,
  `dbszam` int(255) NOT NULL,
  `termekAr` int(255) NOT NULL,
  `termekKep` varchar(255) NOT NULL,
  `vegosszeg` int(255) NOT NULL,
  `termekAnyag` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `rendelesek`
--

CREATE TABLE `rendelesek` (
  `id` int(25) NOT NULL,
  `statusz` varchar(255) NOT NULL,
  `osszeg` int(255) NOT NULL,
  `ido` timestamp(6) NOT NULL DEFAULT current_timestamp(6) ON UPDATE current_timestamp(6),
  `vasarlo_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `rendeles_tetelek`
--

CREATE TABLE `rendeles_tetelek` (
  `id` int(11) NOT NULL,
  `rendeles_id` int(11) NOT NULL,
  `termek_id` int(11) NOT NULL,
  `dbszam` int(11) NOT NULL,
  `termekAr` int(11) NOT NULL,
  `vegosszeg` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `termekek`
--

CREATE TABLE `termekek` (
  `id` int(11) NOT NULL,
  `ar` int(10) NOT NULL,
  `suly` decimal(6,0) NOT NULL,
  `anyag` varchar(25) NOT NULL,
  `leiras` varchar(600) NOT NULL,
  `meret` int(25) NOT NULL,
  `nev` varchar(25) NOT NULL,
  `kategoriaID` int(25) NOT NULL,
  `kep` varchar(250) NOT NULL,
  `keszlet` int(25) NOT NULL,
  `haromD` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- A tábla adatainak kiíratása `termekek`
--

INSERT INTO `termekek` (`id`, `ar`, `suly`, `anyag`, `leiras`, `meret`, `nev`, `kategoriaID`, `kep`, `keszlet`, `haromD`) VALUES
(31, 250000, 10, 'sárgaarany', 'Sárgaarany gyűrű kék gyémánttal.', 52, 'Arany gyűrű', 1, '1744272352102_KeÌpernyoÌfotoÌ 2025-04-10 - 10.05.10.png', 20, '1744107506263_gyuru2 arany-kek.glb'),
(32, 70000, 7, 'ezüst', 'Ez egy elegáns, letisztult ezüst gyűrű, melynek középpontjában egy ragyogó piros kő helyezkedik el. A kő élénk színe kontrasztot alkot a hűvös fényű ezüsttel, így a gyűrű egyszerre klasszikus és figyelemfelkeltő. Tökéletes választás lehet különleges alkalmakra vagy akár mindennapi viseletként is, egy kis karaktert adva a megjelenéshez.', 52, 'Ezüst gyűrű', 1, '1744272760081_KeÌpernyoÌkeÌpek â FaÌjlkezeloÌ 2025. 04. 07. 21_00_20.png', 15, '1744272760082_gyuru2 ezust-piros (1).glb'),
(33, 300000, 9, 'vörösarany', 'Ez a vörösarany gyűrű kifinomult megjelenésével és ragyogó átlátszó köveivel a nőies elegancia megtestesítője. A meleg tónusú vörösarany fém alapon finoman elhelyezett kövek káprázatosan csillognak, ahogy a fény rájuk esik. A gyűrű letisztult vonalvezetése modern, mégis időtálló stílust sugall, így tökéletes választás lehet különleges alkalmakra vagy egyedi kiegészítőként a mindennapokra is.', 48, 'Vörösarany gyűrű', 1, '1744272955956_React App - Google Chrome 2025. 04. 07. 21_11_41.png', 30, '1744272955975_gyuru rosegold-ezust (1).glb'),
(34, 500000, 9, 'sárgaarany', 'Ez az arany gyűrű klasszikus eleganciát sugároz, középpontjában egy mély kék kővel, amely a nyugalmat és méltóságot idézi. A fényesen csillogó arany foglalat szépen kiemeli a kő gazdag színét, így a gyűrű igazán feltűnő darab. Letisztult formavilágának köszönhetően egyszerre elegáns és visszafogott, így ideális választás lehet mindennapi viseletre vagy különleges alkalmakra egyaránt.', 52, 'Arany gyűrű kék kővel', 1, '1744274205294_React App - Google Chrome 2025. 04. 07. 20_57_30.png', 30, '1744274205308_gyuru arany-kek (1).glb'),
(35, 60000, 10, 'ezüst', 'Ez az ezüst karlánc finom kidolgozásával és letisztult stílusával a kifinomult ízlés tökéletes kiegészítője. A fényes, sima felületű láncszemek diszkréten csillognak a fényben, elegáns megjelenést kölcsönözve viselőjének. Könnyed, mégis tartós kialakítása miatt kényelmes viselet egész nap, akár önmagában, akár más karkötőkkel kombinálva is jól mutat. Ajándéknak is ideális, időtálló darab.', 15, 'Ezüst karlánc', 3, '1744321621114_tennisbracelet.jpeg', 20, ''),
(36, 250000, 7, 'sárgaarany', 'Ez az arany karlánc a klasszikus luxus és a kifinomultság tökéletes megtestesítője. Meleg aranyfénye elegánsan vonzza a tekintetet, miközben a precízen megmunkált láncszemek időtálló stílust sugallnak. Kialakítása kényelmes viseletet biztosít, így ideális választás lehet mindennapokra, de különleges alkalmakon is stílusos kiegészítőként ragyog. Letisztult, mégis karakteres ékszer, ami bármilyen megjelenést emel.', 15, 'Arany karlánc', 3, '1744276945965_arany karlaÌnc .jpeg', 20, ''),
(37, 30000, 5, 'ezüst', 'Ez az ezüst karlánc finom kidolgozásával és letisztult stílusával a kifinomult ízlés tökéletes kiegészítője. A fényes, sima felületű láncszemek diszkréten csillognak a fényben, elegáns megjelenést kölcsönözve viselőjének. Könnyed, mégis tartós kialakítása miatt kényelmes viselet egész nap, akár önmagában, akár más karkötőkkel kombinálva is jól mutat. Ajándéknak is ideális, időtálló darab.', 15, 'Ezüst karlánc', 3, '1744277024342_ezuÌst karlaÌnc.jpeg', 20, ''),
(38, 300000, 5, '', 'Ez a vörösarany karlánc a melegség és elegancia harmonikus ötvözete. A lágy rézárnyalatú arany egyedülálló, selymes fénye különlegessé teszi a darabot, miközben a finoman megmunkált láncszemek időtálló stílust és modern nőiességet sugallnak. Diszkrét, mégis figyelemfelkeltő ékszer, amely önmagában is megállja a helyét, de más vörösarany darabokkal rétegezve is stílusos megjelenést biztosít. Tökéletes választás azoknak, akik a klasszikust egy kis csavarral szeretik.', 15, 'Vörösarany karlánc', 3, '1744277169841_voÌroÌs arany karlaÌnc.jpeg', 20, ''),
(39, 500000, 12, 'sárgaarany', 'Ez az arany nyaklánc időtlen eleganciát és kifinomultságot sugároz. A finoman megmunkált lánc ragyogó aranyfénye minden mozdulatra életre kel, diszkréten vonzza a tekintetet. Letisztult formavilága miatt tökéletes önmagában viselve is, de medállal kiegészítve még személyesebbé tehető. Ideális választás mindennapi viseletre vagy különleges alkalmakra – egy olyan ékszer, ami sosem megy ki a divatból.', 45, 'Arany nyaklánc', 2, '1744279078912_arany nyaklaÌnc .jpeg', 20, ''),
(40, 45000, 14, 'ezüst', 'Ez az ezüst nyaklánc letisztult stílusával és finom csillogásával tökéletes kiegészítője bármilyen megjelenésnek. A fényesen polírozott láncszemek elegáns, mégis visszafogott hatást keltenek, így ideális választás lehet mindennapi viseletre vagy különleges alkalmakra is. Hordható önmagában a minimalista stílus kedvelőinek, de medállal kombinálva személyesebb, egyedi ékszerré válhat. Tartós, időtálló darab, amely bármely ékszergyűjtemény alapja lehet.', 50, 'Ezüst nyaklánc', 2, '1744279216789_ezuÌst nyaklaÌnc .jpeg', 20, ''),
(41, 500000, 14, 'vörösarany', 'Ez a vörösarany nyaklánc a romantikus elegancia megtestesítője. A lágy rózsás árnyalatú fém meleg, nőies ragyogást kölcsönöz a darabnak, miközben a finoman kidolgozott láncszemek kifinomultságot és stílust sugallnak. Letisztult formája miatt kiváló választás önmagában viselve, de medállal kiegészítve még személyesebbé és különlegesebbé válhat. Tökéletes mindennapi ékszer, amely különleges alkalmakon is megállja a helyét.', 45, 'Vörösarany nyaklánc', 2, '1744279354692_voÌroÌsarany nyaklaÌnc .jpeg', 20, ''),
(42, 550000, 15, 'sárgaarany', 'Ez az arany nyaklánc időtlen eleganciát és kifinomultságot sugároz. A finoman megmunkált lánc ragyogó aranyfénye minden mozdulatra életre kel, diszkréten vonzza a tekintetet. Letisztult formavilága miatt tökéletes önmagában viselve is, de medállal kiegészítve még személyesebbé tehető. Ideális választás mindennapi viseletre vagy különleges alkalmakra – egy olyan ékszer, ami sosem megy ki a divatból.', 50, 'Arany nyaklánc', 2, '1744279471661_arany nyaklanc2.jpeg', 20, ''),
(43, 80000, 5, 'sárgaarany', 'Ez az arany fülbevaló a klasszikus elegancia és a kifinomult stílus tökéletes egyensúlya. Ragyogó aranyfénye finoman kiemeli az arc vonásait, miközben letisztult formavilága időtálló megjelenést biztosít. Legyen szó apró kísérő darabról vagy hangsúlyosabb formáról, ez a fülbevaló méltó kiegészítője lehet mindennapi öltözéknek és alkalmi megjelenésnek egyaránt. Elegáns, mégis sokoldalúan viselhető darab, amely sosem megy ki a divatból.', 20, 'Arany fülbevaló', 4, '1744280357853_KeÌpernyoÌfotoÌ 2025-04-10 - 12.18.40.png', 20, '1744280294333_javitott fulbevalo vegleges.glb'),
(45, 20000, 5, 'ezüst', 'Ez az ezüst fülbevaló a letisztult elegancia és a modern stílus tökéletes találkozása. A hűvös, fényes ezüstfény diszkréten csillan meg a fülön, finom, mégis karakteres megjelenést biztosítva. Könnyed kialakítása kényelmes viseletet garantál egész nap, így ideális választás lehet hétköznapi outfitekhez vagy akár alkalmi megjelenéshez is. Egy sokoldalú, időtálló darab, amely bármilyen stílushoz könnyedén illeszkedik.', 5, 'Ezüst fülbevaló', 4, '1744320764602_KeÌpernyoÌfotoÌ 2025-04-10 - 23.32.11.png', 20, '1744320694914_fulbevalo ezust.glb'),
(46, 150000, 7, 'sárgaarany', 'Ez az arany fülbevaló a klasszikus elegancia és a kifinomult stílus tökéletes egyensúlya. Ragyogó aranyfénye finoman kiemeli az arc vonásait, miközben letisztult formavilága időtálló megjelenést biztosít. Legyen szó apró kísérő darabról vagy hangsúlyosabb formáról, ez a fülbevaló méltó kiegészítője lehet mindennapi öltözéknek és alkalmi megjelenésnek egyaránt. Elegáns, mégis sokoldalúan viselhető darab, amely sosem megy ki a divatból.', 5, 'Arany fülbevaló', 4, '1744320947114_KeÌpernyoÌfotoÌ 2025-04-10 - 23.34.53.png', 20, '1744320873942_fulbevalo arany.glb'),
(47, 170000, 5, 'vörösarany', 'A ChatGPT ezt mondta:\r\nEz a vörösarany fülbevaló elegáns és nőies megjelenést kölcsönöz viselőjének. A meleg, rózsás tónusú nemesfém lágyan ragyog a fényben, kiemelve az arc finom vonásait. Letisztult formatervezése időtálló stílust képvisel, így tökéletes választás lehet mindennapi viseletre, de különleges alkalmakra is kiváló kiegészítő. Ez a fülbevaló igazi ékszerdobozba való darab: visszafogott, mégis különleges.', 5, 'Vörösarany fülbevaló', 4, '1744321419126_KeÌpernyoÌfotoÌ 2025-04-10 - 23.43.05.png', 20, '1744321367736_fulbevalo vorosarany-ezust (1).glb');

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `vasarlok`
--

CREATE TABLE `vasarlok` (
  `id` int(11) NOT NULL,
  `nev` varchar(255) NOT NULL,
  `jelszo` varchar(255) NOT NULL,
  `email` varchar(50) NOT NULL,
  `usertel` varchar(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Indexek a kiírt táblákhoz
--

--
-- A tábla indexei `admin`
--
ALTER TABLE `admin`
  ADD PRIMARY KEY (`id`);

--
-- A tábla indexei `kategoria`
--
ALTER TABLE `kategoria`
  ADD PRIMARY KEY (`id`);

--
-- A tábla indexei `kosar`
--
ALTER TABLE `kosar`
  ADD PRIMARY KEY (`id`),
  ADD KEY `kosar_ibfk_1` (`termekID`);

--
-- A tábla indexei `rendelesek`
--
ALTER TABLE `rendelesek`
  ADD PRIMARY KEY (`id`),
  ADD KEY `rendelesek_ibfk_2` (`vasarlo_id`);

--
-- A tábla indexei `rendeles_tetelek`
--
ALTER TABLE `rendeles_tetelek`
  ADD PRIMARY KEY (`id`),
  ADD KEY `rendeles_id` (`rendeles_id`),
  ADD KEY `termek_id` (`termek_id`);

--
-- A tábla indexei `termekek`
--
ALTER TABLE `termekek`
  ADD PRIMARY KEY (`id`),
  ADD KEY `kategoriaID` (`kategoriaID`);

--
-- A tábla indexei `vasarlok`
--
ALTER TABLE `vasarlok`
  ADD PRIMARY KEY (`id`);

--
-- A kiírt táblák AUTO_INCREMENT értéke
--

--
-- AUTO_INCREMENT a táblához `admin`
--
ALTER TABLE `admin`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=71;

--
-- AUTO_INCREMENT a táblához `kosar`
--
ALTER TABLE `kosar`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=68;

--
-- AUTO_INCREMENT a táblához `rendelesek`
--
ALTER TABLE `rendelesek`
  MODIFY `id` int(25) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=51;

--
-- AUTO_INCREMENT a táblához `rendeles_tetelek`
--
ALTER TABLE `rendeles_tetelek`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=52;

--
-- AUTO_INCREMENT a táblához `termekek`
--
ALTER TABLE `termekek`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=48;

--
-- AUTO_INCREMENT a táblához `vasarlok`
--
ALTER TABLE `vasarlok`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- Megkötések a kiírt táblákhoz
--

--
-- Megkötések a táblához `kosar`
--
ALTER TABLE `kosar`
  ADD CONSTRAINT `kosar_ibfk_1` FOREIGN KEY (`termekID`) REFERENCES `termekek` (`id`);

--
-- Megkötések a táblához `rendelesek`
--
ALTER TABLE `rendelesek`
  ADD CONSTRAINT `rendelesek_ibfk_2` FOREIGN KEY (`vasarlo_id`) REFERENCES `vasarlok` (`id`);

--
-- Megkötések a táblához `rendeles_tetelek`
--
ALTER TABLE `rendeles_tetelek`
  ADD CONSTRAINT `rendeles_tetelek_ibfk_1` FOREIGN KEY (`rendeles_id`) REFERENCES `rendelesek` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `rendeles_tetelek_ibfk_2` FOREIGN KEY (`termek_id`) REFERENCES `termekek` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Megkötések a táblához `termekek`
--
ALTER TABLE `termekek`
  ADD CONSTRAINT `termekek_ibfk_1` FOREIGN KEY (`kategoriaID`) REFERENCES `kategoria` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
