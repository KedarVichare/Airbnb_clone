-- MySQL dump 10.13  Distrib 8.0.43, for Win64 (x86_64)
--
-- Host: localhost    Database: airbnb_db
-- ------------------------------------------------------
-- Server version	8.0.43

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `bookings`
--

DROP TABLE IF EXISTS `bookings`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `bookings` (
  `id` int NOT NULL AUTO_INCREMENT,
  `property_id` int NOT NULL,
  `traveler_id` int NOT NULL,
  `start_date` date NOT NULL DEFAULT (curdate()),
  `end_date` date NOT NULL DEFAULT ((curdate() + interval 1 day)),
  `guests` int NOT NULL DEFAULT '1',
  `status` enum('PENDING','ACCEPTED','CANCELLED') DEFAULT 'PENDING',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `property_id` (`property_id`),
  KEY `traveler_id` (`traveler_id`),
  CONSTRAINT `bookings_ibfk_1` FOREIGN KEY (`property_id`) REFERENCES `properties` (`id`) ON DELETE CASCADE,
  CONSTRAINT `bookings_ibfk_2` FOREIGN KEY (`traveler_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `bookings`
--

LOCK TABLES `bookings` WRITE;
/*!40000 ALTER TABLE `bookings` DISABLE KEYS */;
INSERT INTO `bookings` VALUES (1,1,2,'2025-10-01','2025-10-05',2,'PENDING','2025-09-24 06:08:29'),(2,1,2,'2025-10-17','2025-10-18',1,'PENDING','2025-10-17 09:48:23'),(3,1,2,'2025-10-17','2025-10-18',1,'PENDING','2025-10-17 09:50:56'),(4,33,2,'2025-10-02','2025-10-04',3,'PENDING','2025-10-25 08:09:11');
/*!40000 ALTER TABLE `bookings` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `favourites`
--

DROP TABLE IF EXISTS `favourites`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `favourites` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `property_id` int NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_fav` (`user_id`,`property_id`),
  KEY `property_id` (`property_id`),
  CONSTRAINT `favourites_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `favourites_ibfk_2` FOREIGN KEY (`property_id`) REFERENCES `properties` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `favourites`
--

LOCK TABLES `favourites` WRITE;
/*!40000 ALTER TABLE `favourites` DISABLE KEYS */;
INSERT INTO `favourites` VALUES (2,37,34,'2025-10-25 04:01:35'),(3,37,33,'2025-10-25 04:05:31'),(4,37,32,'2025-10-25 04:05:32');
/*!40000 ALTER TABLE `favourites` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `properties`
--

DROP TABLE IF EXISTS `properties`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `properties` (
  `id` int NOT NULL AUTO_INCREMENT,
  `owner_id` int NOT NULL,
  `title` varchar(255) NOT NULL,
  `description` text,
  `type` varchar(100) DEFAULT NULL,
  `location` varchar(150) DEFAULT NULL,
  `price` decimal(10,2) NOT NULL,
  `amenities` text,
  `bedrooms` int DEFAULT NULL,
  `bathrooms` int DEFAULT NULL,
  `guests` int DEFAULT NULL,
  `available_from` date DEFAULT NULL,
  `available_to` date DEFAULT NULL,
  `photo_url` varchar(500) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `owner_id` (`owner_id`),
  CONSTRAINT `properties_ibfk_1` FOREIGN KEY (`owner_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=62 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `properties`
--

LOCK TABLES `properties` WRITE;
/*!40000 ALTER TABLE `properties` DISABLE KEYS */;
INSERT INTO `properties` VALUES (1,1,'Cozy Apartment','2BHK near downtown',NULL,'San Jose, CA',120.00,NULL,2,1,NULL,NULL,NULL,'https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg','2025-09-24 06:08:29'),(32,1,'Cozy Apartment in NYC','1BHK apartment near Central Park','Apartment','New York',120.00,'WiFi, Kitchen, Heating',1,1,2,'2025-09-28','2025-12-31','https://images.pexels.com/photos/259962/pexels-photo-259962.jpeg','2025-09-29 04:41:28'),(33,2,'Luxury Villa in LA','Spacious villa with pool and garden','Villa','Los Angeles',350.00,'Pool, Garden, WiFi, Parking, Air Conditioning',4,3,NULL,'2025-09-28','2025-12-30','https://images.pexels.com/photos/2102587/pexels-photo-2102587.jpeg','2025-09-29 04:41:28'),(34,3,'Beach House in Miami','Oceanfront property with stunning view','House','Miami',280.00,'Beach Access, Pool, WiFi, Kitchen, Air Conditioning',3,2,NULL,'2025-09-28','2026-01-15','https://images.pexels.com/photos/261102/pexels-photo-261102.jpeg','2025-09-29 04:41:28'),(35,4,'Studio in San Francisco','Compact studio near Golden Gate','Apartment','San Francisco',150.00,'Downtown View, WiFi, Heating, Kitchen',1,1,NULL,'2025-09-28','2025-11-30','https://images.pexels.com/photos/813691/pexels-photo-813691.jpeg','2025-09-29 04:41:28'),(36,5,'Cabin in Denver','Wooden cabin in the mountains','Cabin','Denver',100.00,'Mountain View, Fireplace, WiFi, Parking',2,1,NULL,'2025-09-28','2025-12-20','https://images.pexels.com/photos/789380/pexels-photo-789380.jpeg','2025-09-29 04:41:28'),(37,6,'Penthouse in Chicago','Skyline view with 2 bedrooms',NULL,'Chicago',220.00,'City View, Gym, WiFi, Parking, Heating',3,2,NULL,'2025-09-28','2025-12-15','https://images.pexels.com/photos/323705/pexels-photo-323705.jpeg','2025-09-29 04:41:28'),(38,7,'Countryside Cottage','Peaceful cottage with garden','Cottage','Austin',90.00,'Garden, Fireplace, WiFi, Parking, Air Conditioning',3,2,NULL,'2025-09-28','2025-12-01','https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg','2025-09-29 04:41:28'),(39,8,'Luxury Condo','2BHK modern condo downtown','Condo','Seattle',200.00,'Downtown View, Gym, WiFi, Parking, Air Conditioning',2,2,NULL,'2025-09-28','2025-12-31','https://images.pexels.com/photos/261146/pexels-photo-261146.jpeg','2025-09-29 04:41:28'),(40,9,'Historic House','Vintage-style home near museums','House','Boston',175.00,'Vintage Decor, Kitchen, WiFi, Heating',3,2,NULL,'2025-09-28','2025-12-10','https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg','2025-09-29 04:41:28'),(41,10,'Lakeview Cabin','Cabin overlooking beautiful lake','Cabin','Minneapolis',130.00,'Lake View, Fireplace, WiFi, Parking, Heating',2,1,NULL,'2025-09-28','2025-12-20','https://images.pexels.com/photos/1643383/pexels-photo-1643383.jpeg','2025-09-29 04:41:28'),(42,11,'Desert Villa','Spacious villa in Arizona desert','Villa','Phoenix',180.00,'Pool, Air Conditioning, WiFi, Garden, Parking',3,2,NULL,'2025-09-28','2025-12-25','https://images.pexels.com/photos/703141/pexels-photo-703141.jpeg','2025-09-29 04:41:28'),(43,12,'Treehouse Stay','Unique experience in a treehouse','Treehouse','Portland',110.00,'Nature View, Outdoor Deck, WiFi',1,1,NULL,'2025-09-28','2025-12-05','https://images.pexels.com/photos/2383857/pexels-photo-2383857.jpeg','2025-09-29 04:41:28'),(44,13,'City Loft','Modern loft in downtown area','Loft','Houston',160.00,'Modern Interior, WiFi, Air Conditioning, Kitchen',2,1,NULL,'2025-09-28','2025-11-25','https://images.pexels.com/photos/276724/pexels-photo-276724.jpeg','2025-09-29 04:41:28'),(45,14,'Ski Resort Cabin','Cabin near ski slopes','Cabin','Salt Lake City',190.00,'Fireplace, Ski Storage, WiFi, Heating, Parking',3,2,NULL,'2025-09-28','2026-02-28','https://images.pexels.com/photos/258154/pexels-photo-258154.jpeg','2025-09-29 04:41:28'),(46,15,'Farmhouse Retreat','Spacious farmhouse with fields','House','Nashville',140.00,'Large Garden, Fireplace, WiFi, Parking, Kitchen',4,3,NULL,'2025-09-28','2025-12-30','https://images.pexels.com/photos/259957/pexels-photo-259957.jpeg','2025-09-29 04:41:28'),(47,16,'Beachfront Condo','Condo right on the beach','Condo','San Diego',250.00,'Beach View, Balcony, WiFi, Air Conditioning, Kitchen',2,2,NULL,'2025-09-28','2025-12-31','https://images.pexels.com/photos/2102588/pexels-photo-2102588.jpeg','2025-09-29 04:41:28'),(48,17,'Mountain View Apartment','Apartment with mountain views','Apartment','Denver',170.00,'Mountain View, WiFi, Heating, Balcony',2,1,NULL,'2025-09-28','2025-12-31','https://images.pexels.com/photos/1571458/pexels-photo-1571458.jpeg','2025-09-29 04:41:28'),(49,18,'Cottage by the Bay','Cozy cottage with bay view','Apartment','San Francisco',190.00,'Bay View, Kitchen, WiFi, Parking',2,1,NULL,'2025-09-28','2025-12-20','https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg','2025-09-29 04:41:28'),(50,19,'Modern Studio','Stylish studio near nightlife','Studio','Las Vegas',130.00,'Nightlife Nearby, WiFi, Air Conditioning, Kitchen',1,1,NULL,'2025-09-28','2025-12-15','https://images.pexels.com/photos/1571461/pexels-photo-1571461.jpeg','2025-09-29 04:41:28'),(51,20,'Downtown Loft','Spacious loft with city view','Loft','Dallas',160.00,'City View, Gym Access, WiFi, Parking',2,2,NULL,'2025-09-28','2025-12-18','https://images.pexels.com/photos/1571463/pexels-photo-1571463.jpeg','2025-09-29 04:41:28'),(52,21,'Seaside Villa','Luxury villa with sea access','Villa','Honolulu',400.00,'Ocean Access, Pool, Air Conditioning, WiFi, Garden',4,3,NULL,'2025-09-28','2026-01-05','https://images.pexels.com/photos/1571462/pexels-photo-1571462.jpeg','2025-09-29 04:41:28'),(53,22,'Suburban House','3BHK family house','House','San Jose',150.00,'Backyard, Kitchen, WiFi, Parking, Air Conditioning',3,2,NULL,'2025-09-28','2025-12-25','https://images.pexels.com/photos/259962/pexels-photo-259962.jpeg','2025-09-29 04:41:28'),(54,23,'Eco Lodge','Sustainable stay in the forest',NULL,'Boulder',120.00,'Solar Energy, Nature Trails, WiFi, Eco-friendly Design',2,1,NULL,'2025-09-28','2025-11-30','https://images.pexels.com/photos/1571464/pexels-photo-1571464.jpeg','2025-09-29 04:41:28'),(55,24,'Riverfront Apartment','Apartment facing the river',NULL,'Philadelphia',180.00,'River View, WiFi, Kitchen, Parking, Heating',2,1,NULL,'2025-09-28','2025-12-12','https://images.pexels.com/photos/2102589/pexels-photo-2102589.jpeg','2025-09-29 04:41:28'),(56,25,'Studio Downtown','Budget-friendly studio','Apartment','Atlanta',90.00,'Downtown View, WiFi, Air Conditioning, Kitchen',1,1,NULL,'2025-09-28','2025-12-15','https://images.pexels.com/photos/813691/pexels-photo-813691.jpeg','2025-09-29 04:41:28'),(57,26,'Countryside Cabin','Quiet stay in woods','Cabin','Vermont',100.00,'Nature View, Fireplace, WiFi, Parking, Heating',2,1,NULL,'2025-09-28','2025-11-20','https://images.pexels.com/photos/789380/pexels-photo-789380.jpeg','2025-09-29 04:41:28'),(58,27,'City Apartment','1BHK apartment near subway','Apartment','Washington DC',160.00,'Subway Access, WiFi, Air Conditioning, Kitchen',1,1,NULL,'2025-09-28','2025-12-28','https://images.pexels.com/photos/276724/pexels-photo-276724.jpeg','2025-09-29 04:41:28'),(59,28,'Mountain Lodge','Luxury lodge with hot tub','Lodge','Aspen',300.00,'Hot Tub, Fireplace, WiFi, Mountain View, Parking',3,2,NULL,'2025-09-28','2026-02-01','https://images.pexels.com/photos/1571458/pexels-photo-1571458.jpeg','2025-09-29 04:41:28'),(60,29,'Garden Cottage','Cottage with private garden','Cottage','Orlando',140.00,'Private Garden, WiFi, Parking, Air Conditioning',2,1,NULL,'2025-09-28','2025-12-31','https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg','2025-09-29 04:41:28'),(61,30,'Lake House','House by the lake','House','Seattle',200.00,'Lake View, Balcony, WiFi, Kitchen, Fireplace',3,2,NULL,'2025-09-28','2025-12-20','https://images.pexels.com/photos/1643383/pexels-photo-1643383.jpeg','2025-09-29 04:41:28');
/*!40000 ALTER TABLE `properties` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` enum('traveler','owner') NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `location` varchar(255) DEFAULT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `about` text,
  `city` varchar(100) DEFAULT NULL,
  `state` varchar(10) DEFAULT NULL,
  `country` varchar(100) DEFAULT NULL,
  `languages` varchar(100) DEFAULT NULL,
  `gender` varchar(10) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=39 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'Alice Host','alice@host.com','hashedpassword','owner','2025-09-24 06:08:29',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(2,'Bob Traveler','bob@travel.com','hashedpassword','traveler','2025-09-24 06:08:29',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(3,'fdjlf Host','fdfd@host.com','$2b$10$5wd9hw3dhgnUSX27sdBpHe4O46uL6eJYsJ3ZJ4IlLDb8rRKoCzgRK','owner','2025-09-26 09:04:15',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(4,'Kedar Vichare','kedarprashant.vichare@sjsu.edu','$2b$10$k75LKc2LoKd5CDc4/i3ATuN7lKT7IMDM4fPdUWysML0r1luBmTUcK','traveler','2025-09-29 02:01:18',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(5,'Mounaa','mouna@gmail.com','$2b$10$slBWGBllZ4zsA5UgQ0Vzm.dBaFzbf5iXD1uUvuJ89B34V6dpUyaHC','traveler','2025-09-29 02:05:21',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(6,'Owner 1','owner1@example.com','hashedpassword','owner','2025-09-29 04:41:23',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(7,'Owner 2','owner2@example.com','hashedpassword','owner','2025-09-29 04:41:23',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(8,'Owner 3','owner3@example.com','hashedpassword','owner','2025-09-29 04:41:23',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(9,'Owner 4','owner4@example.com','hashedpassword','owner','2025-09-29 04:41:23',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(10,'Owner 5','owner5@example.com','hashedpassword','owner','2025-09-29 04:41:23',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(11,'Owner 6','owner6@example.com','hashedpassword','owner','2025-09-29 04:41:23',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(12,'Owner 7','owner7@example.com','hashedpassword','owner','2025-09-29 04:41:23',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(13,'Owner 8','owner8@example.com','hashedpassword','owner','2025-09-29 04:41:23',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(14,'Owner 9','owner9@example.com','hashedpassword','owner','2025-09-29 04:41:23',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(15,'Owner 10','owner10@example.com','hashedpassword','owner','2025-09-29 04:41:23',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(16,'Owner 11','owner11@example.com','hashedpassword','owner','2025-09-29 04:41:23',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(17,'Owner 12','owner12@example.com','hashedpassword','owner','2025-09-29 04:41:23',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(18,'Owner 13','owner13@example.com','hashedpassword','owner','2025-09-29 04:41:23',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(19,'Owner 14','owner14@example.com','hashedpassword','owner','2025-09-29 04:41:23',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(20,'Owner 15','owner15@example.com','hashedpassword','owner','2025-09-29 04:41:23',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(21,'Owner 16','owner16@example.com','hashedpassword','owner','2025-09-29 04:41:23',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(22,'Owner 17','owner17@example.com','hashedpassword','owner','2025-09-29 04:41:23',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(23,'Owner 18','owner18@example.com','hashedpassword','owner','2025-09-29 04:41:23',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(24,'Owner 19','owner19@example.com','hashedpassword','owner','2025-09-29 04:41:23',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(25,'Owner 20','owner20@example.com','hashedpassword','owner','2025-09-29 04:41:23',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(26,'Owner 21','owner21@example.com','hashedpassword','owner','2025-09-29 04:41:23',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(27,'Owner 22','owner22@example.com','hashedpassword','owner','2025-09-29 04:41:23',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(28,'Owner 23','owner23@example.com','hashedpassword','owner','2025-09-29 04:41:23',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(29,'Owner 24','owner24@example.com','hashedpassword','owner','2025-09-29 04:41:23',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(30,'Owner 25','owner25@example.com','hashedpassword','owner','2025-09-29 04:41:23',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(31,'Owner 26','owner26@example.com','hashedpassword','owner','2025-09-29 04:41:23',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(32,'Owner 27','owner27@example.com','hashedpassword','owner','2025-09-29 04:41:23',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(33,'Owner 28','owner28@example.com','hashedpassword','owner','2025-09-29 04:41:23',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(34,'Owner 29','owner29@example.com','hashedpassword','owner','2025-09-29 04:41:23',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(35,'Owner 30','owner30@example.com','hashedpassword','owner','2025-09-29 04:41:23',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(36,'Meera','meera@gmail.com','$2b$10$npZwm/r0Kr/Ee8duIZvIbeVhqJcQXLH1UP/aq2exqzZcU4JhtjqYK','traveler','2025-09-29 08:32:53',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(37,'Chetana','chets@gmail.com','$2b$10$IRZC0h25HnsfmOaPpuVy8uUax8Jp.DzLUGGMkqNxwkb5rBIDY9try','traveler','2025-10-17 04:03:12',NULL,'669754321','I am an SDE','San Jose','CA','United States','English','Female'),(38,'Kedar','kedar@gmail.com','$2b$10$8oKnZJaJp.L2fDBxTot2VOcZ94MSLPl2mX6gYg7Jmh3BlnHeElJOW','owner','2025-10-25 09:13:49',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL);
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-10-25  2:32:15
