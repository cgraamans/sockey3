-- --------------------------------------------------------
-- Host:                         phobos
-- Server version:               10.1.23-MariaDB-9+deb9u1 - Raspbian 9.0
-- Server OS:                    debian-linux-gnueabihf
-- HeidiSQL Version:             9.5.0.5196
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;

-- Dumping structure for table sockey3.user.bans
CREATE TABLE IF NOT EXISTS `user.bans` (
  `id` int(255) NOT NULL AUTO_INCREMENT,
  `user_id` int(255) DEFAULT NULL,
  `host` text,
  `reason` text,
  `by_admin` int(255) NOT NULL,
  `dt` int(10) NOT NULL,
  `active` tinyint(1) NOT NULL DEFAULT '1',
  PRIMARY KEY (`id`),
  KEY `FK1_u_bans` (`user_id`),
  CONSTRAINT `FK1_u_bans` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Dumping data for table sockey3.user.bans: ~0 rows (approximately)
/*!40000 ALTER TABLE `user.bans` DISABLE KEYS */;
/*!40000 ALTER TABLE `user.bans` ENABLE KEYS */;

-- Dumping structure for table sockey3.user.location
CREATE TABLE IF NOT EXISTS `user.location` (
  `user_id` int(255) DEFAULT NULL,
  `latitude` int(32) DEFAULT NULL,
  `longitude` int(32) DEFAULT NULL,
  `speed` int(32) DEFAULT NULL,
  `elevation` int(32) DEFAULT NULL,
  KEY `FK1_u_location` (`user_id`),
  CONSTRAINT `FK1_u_location` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Dumping data for table sockey3.user.location: ~0 rows (approximately)
/*!40000 ALTER TABLE `user.location` DISABLE KEYS */;
/*!40000 ALTER TABLE `user.location` ENABLE KEYS */;

-- Dumping structure for table sockey3.user.tokens
CREATE TABLE IF NOT EXISTS `user.tokens` (
  `id` int(255) NOT NULL AUTO_INCREMENT,
  `user_id` int(255) NOT NULL,
  `token` varchar(255) NOT NULL,
  `persistent` tinyint(1) NOT NULL DEFAULT '1',
  `dt` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FK1_u_tokens` (`user_id`),
  CONSTRAINT `FK1_u_tokens` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Dumping data for table sockey3.user.tokens: ~0 rows (approximately)
/*!40000 ALTER TABLE `user.tokens` DISABLE KEYS */;
/*!40000 ALTER TABLE `user.tokens` ENABLE KEYS */;

-- Dumping structure for table sockey3.users
CREATE TABLE IF NOT EXISTS `users` (
  `id` int(255) NOT NULL AUTO_INCREMENT,
  `name` varchar(64) NOT NULL,
  `email` varchar(128) DEFAULT NULL,
  `password` varchar(128) NOT NULL,
  `api_id` varchar(128) NOT NULL,
  `api_token` varchar(128) DEFAULT NULL,
  `dt_register` int(10) NOT NULL,
  `dt_deactivate` int(10) DEFAULT NULL,
  `active` int(1) NOT NULL DEFAULT '1',
  `auth` int(1) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Dumping data for table sockey3.users: ~2 rows (approximately)
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT IGNORE INTO `users` (`id`, `name`, `email`, `password`, `api_id`, `api_token`, `dt_register`, `dt_deactivate`, `active`, `auth`) VALUES
	(1, 'TestUserRegular', 'test.normalUser@gmail.com', 'aa14eb816d02e876798ed1143f50851819d2a81bbbf77d9ab9089d78740d5df3', '30bcef2f0d16b459dedfe8d8744f00580abbe65d2d745729009abf9dd5b52f6c', NULL, 1531610813, NULL, 1, 0),
	(2, 'TestUserAdmin', NULL, 'aa14eb816d02e876798ed1143f50851819d2a81bbbf77d9ab9089d78740d5df3', '30bcef2f0d16b459dedfe8d8744f00580abbe65d2d745729009abf9dd5b52f6c', NULL, 1531610813, NULL, 1, 2);
/*!40000 ALTER TABLE `users` ENABLE KEYS */;

/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IF(@OLD_FOREIGN_KEY_CHECKS IS NULL, 1, @OLD_FOREIGN_KEY_CHECKS) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
