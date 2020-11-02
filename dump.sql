
DROP TABLE IF EXISTS `clock`;
CREATE TABLE `clock` (
  `userId` int NOT NULL,
  `clock_in` datetime NOT NULL,
  `clock_out` datetime NOT NULL,
  `status` tinyint DEFAULT NULL,
  PRIMARY KEY (`userId`,`clock_in`,`clock_out`),
  CONSTRAINT `fk_userId` FOREIGN KEY (`userId`) REFERENCES `user` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
LOCK TABLES `clock` WRITE;
INSERT INTO `clock` VALUES (1,'2020-10-10 08:00:00','2020-10-10 18:00:00',0),(1,'2020-10-11 08:00:00','2020-10-11 13:00:00',0),(1,'2020-10-20 08:00:00','2020-10-20 08:30:00',0);
UNLOCK TABLES;

--
-- Table structure for table `user`
--

DROP TABLE IF EXISTS `user`;
CREATE TABLE `user` (
  `id` int NOT NULL AUTO_INCREMENT,
  `username` varchar(255) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `token` varchar(255) DEFAULT NULL,
  `team` varchar(255) DEFAULT NULL,
  `role` tinyint DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `user`
--

LOCK TABLES `user` WRITE;
/*!40000 ALTER TABLE `user` DISABLE KEYS */;
INSERT INTO `user` VALUES (1,'pivil','aaa','123','1',2);
/*!40000 ALTER TABLE `user` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `workingTime`
--

DROP TABLE IF EXISTS `workingTime`;
CREATE TABLE `workingTime` (
  `id` int NOT NULL AUTO_INCREMENT,
  `userId` int NOT NULL,
  `arrival` time DEFAULT NULL,
  `departure` time DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_userId_idx` (`userId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `workingTime`
--

LOCK TABLES `workingTime` WRITE;
/*!40000 ALTER TABLE `workingTime` DISABLE KEYS */;
/*!40000 ALTER TABLE `workingTime` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

