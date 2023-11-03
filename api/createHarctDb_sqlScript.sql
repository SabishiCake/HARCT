CREATE DATABASE  IF NOT EXISTS `harctmydb` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `harctmydb`;
-- MySQL dump 10.13  Distrib 8.0.34, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: harctmydb
-- ------------------------------------------------------
-- Server version	8.0.34

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `apikeys`
--

DROP TABLE IF EXISTS `apikeys`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `apikeys` (
  `ID` int NOT NULL AUTO_INCREMENT,
  `APIKey` varchar(255) NOT NULL,
  `Description` varchar(255) DEFAULT NULL,
  `Type` varchar(45) NOT NULL,
  PRIMARY KEY (`ID`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `apikeys`
--

LOCK TABLES `apikeys` WRITE;
/*!40000 ALTER TABLE `apikeys` DISABLE KEYS */;
INSERT INTO `apikeys` VALUES (1,'asfwe32442dsfw3','First API Key','Type1'),(2,'hfw98efwef23dwe','Second API Key','Type2'),(3,'9d8wefwe9wf34ef','Third API Key','Type1');
/*!40000 ALTER TABLE `apikeys` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `feedback`
--

DROP TABLE IF EXISTS `feedback`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `feedback` (
  `FeedbackID` int NOT NULL,
  `GuestID` int DEFAULT NULL,
  `Comment` varchar(255) DEFAULT NULL,
  `Rating` int DEFAULT NULL,
  PRIMARY KEY (`FeedbackID`),
  KEY `GuestID` (`GuestID`),
  CONSTRAINT `feedback_ibfk_1` FOREIGN KEY (`GuestID`) REFERENCES `guest` (`GuestID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `feedback`
--

LOCK TABLES `feedback` WRITE;
/*!40000 ALTER TABLE `feedback` DISABLE KEYS */;
INSERT INTO `feedback` VALUES (1,101,'Great service!',5),(2,102,'Room was not clean',2),(3,103,'Excellent experience',4);
/*!40000 ALTER TABLE `feedback` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `guest`
--

DROP TABLE IF EXISTS `guest`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `guest` (
  `GuestID` int NOT NULL,
  `LastName` varchar(255) DEFAULT NULL,
  `FirstName` varchar(255) DEFAULT NULL,
  `Email` varchar(255) DEFAULT NULL,
  `Phone` varchar(255) DEFAULT NULL,
  `Address` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`GuestID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `guest`
--

LOCK TABLES `guest` WRITE;
/*!40000 ALTER TABLE `guest` DISABLE KEYS */;
INSERT INTO `guest` VALUES (101,'Smith','John','john.smith@example.com','1234567890','123, Main Street, City'),(102,'Doe','Jane','jane.doe@example.com','9876543210','456, Park Avenue, Town'),(103,'Johnson','Robert','robert.johnson@example.com','4567891230','789, Boulevard, Village');
/*!40000 ALTER TABLE `guest` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `housekeepingtasks`
--

DROP TABLE IF EXISTS `housekeepingtasks`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `housekeepingtasks` (
  `TaskID` int NOT NULL,
  `TaskName` varchar(255) DEFAULT NULL,
  `Description` text,
  `RoomNumber` varchar(50) DEFAULT NULL,
  `Status` enum('Pending','In Progress','Completed') DEFAULT NULL,
  `CreatedAt` timestamp NULL DEFAULT (now()),
  `UpdatedAt` timestamp NULL DEFAULT (now()),
  PRIMARY KEY (`TaskID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `housekeepingtasks`
--

LOCK TABLES `housekeepingtasks` WRITE;
/*!40000 ALTER TABLE `housekeepingtasks` DISABLE KEYS */;
INSERT INTO `housekeepingtasks` VALUES (1,'Clean room','Clean the entire room thoroughly','101','Pending','2023-10-31 12:55:46','2023-10-31 12:55:46'),(2,'Change sheets','Replace the bed sheets and pillow covers','102','In Progress','2023-10-31 12:55:46','2023-10-31 12:55:46'),(3,'Fix broken faucet','Repair the broken faucet in the bathroom','103','Completed','2023-10-31 12:55:46','2023-10-31 12:55:46');
/*!40000 ALTER TABLE `housekeepingtasks` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `laundryitems`
--

DROP TABLE IF EXISTS `laundryitems`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `laundryitems` (
  `ItemID` int NOT NULL,
  `OrderID` int DEFAULT NULL,
  `ItemName` varchar(255) DEFAULT NULL,
  `Quantity` int DEFAULT NULL,
  `Status` enum('Pending','In Progress','Completed') DEFAULT NULL,
  `CreatedAt` timestamp NULL DEFAULT (now()),
  `UpdatedAt` timestamp NULL DEFAULT (now()),
  PRIMARY KEY (`ItemID`),
  KEY `OrderID` (`OrderID`),
  CONSTRAINT `laundryitems_ibfk_1` FOREIGN KEY (`OrderID`) REFERENCES `laundryorders` (`OrderID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `laundryitems`
--

LOCK TABLES `laundryitems` WRITE;
/*!40000 ALTER TABLE `laundryitems` DISABLE KEYS */;
INSERT INTO `laundryitems` VALUES (1,201,'Shirt',3,'Pending','2023-10-31 12:58:38','2023-10-31 12:58:38'),(2,202,'Pants',2,'In Progress','2023-10-31 12:58:38','2023-10-31 12:58:38'),(3,203,'Socks',5,'Completed','2023-10-31 12:58:38','2023-10-31 12:58:38');
/*!40000 ALTER TABLE `laundryitems` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `laundryorders`
--

DROP TABLE IF EXISTS `laundryorders`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `laundryorders` (
  `OrderID` int NOT NULL,
  `GuestID` int DEFAULT NULL,
  `PickupDate` date DEFAULT NULL,
  `DeliveryDate` date DEFAULT NULL,
  `Status` enum('Pending','In Progress','Completed') DEFAULT NULL,
  `CreatedAt` timestamp NULL DEFAULT (now()),
  `UpdatedAt` timestamp NULL DEFAULT (now()),
  PRIMARY KEY (`OrderID`),
  KEY `GuestID` (`GuestID`),
  CONSTRAINT `laundryorders_ibfk_1` FOREIGN KEY (`GuestID`) REFERENCES `guest` (`GuestID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `laundryorders`
--

LOCK TABLES `laundryorders` WRITE;
/*!40000 ALTER TABLE `laundryorders` DISABLE KEYS */;
INSERT INTO `laundryorders` VALUES (201,101,'2023-11-01','2023-11-02','Pending','2023-10-31 12:55:46','2023-10-31 12:55:46'),(202,102,'2023-11-03','2023-11-04','In Progress','2023-10-31 12:55:46','2023-10-31 12:55:46'),(203,103,'2023-11-05','2023-11-06','Completed','2023-10-31 12:55:46','2023-10-31 12:55:46');
/*!40000 ALTER TABLE `laundryorders` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `menuitems`
--

DROP TABLE IF EXISTS `menuitems`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `menuitems` (
  `ItemID` int NOT NULL,
  `Name` varchar(255) DEFAULT NULL,
  `Description` varchar(255) DEFAULT NULL,
  `Price` decimal(10,2) DEFAULT NULL,
  PRIMARY KEY (`ItemID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `menuitems`
--

LOCK TABLES `menuitems` WRITE;
/*!40000 ALTER TABLE `menuitems` DISABLE KEYS */;
INSERT INTO `menuitems` VALUES (1,'Pasta','Delicious pasta with red sauce',12.99),(2,'Steak','Tender steak with mashed potatoes',25.99),(3,'Salad','Fresh and healthy salad with vinaigrette',8.99);
/*!40000 ALTER TABLE `menuitems` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `orderitems`
--

DROP TABLE IF EXISTS `orderitems`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `orderitems` (
  `OrderItemID` int NOT NULL,
  `OrderID` int DEFAULT NULL,
  `ItemID` int DEFAULT NULL,
  `Quantity` int DEFAULT NULL,
  PRIMARY KEY (`OrderItemID`),
  KEY `OrderID` (`OrderID`),
  KEY `ItemID` (`ItemID`),
  CONSTRAINT `orderitems_ibfk_1` FOREIGN KEY (`OrderID`) REFERENCES `orders` (`OrderID`),
  CONSTRAINT `orderitems_ibfk_2` FOREIGN KEY (`ItemID`) REFERENCES `menuitems` (`ItemID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `orderitems`
--

LOCK TABLES `orderitems` WRITE;
/*!40000 ALTER TABLE `orderitems` DISABLE KEYS */;
INSERT INTO `orderitems` VALUES (1,301,1,2),(2,302,2,1),(3,303,3,3);
/*!40000 ALTER TABLE `orderitems` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `orders`
--

DROP TABLE IF EXISTS `orders`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `orders` (
  `OrderID` int NOT NULL,
  `GuestID` int DEFAULT NULL,
  `OrderDate` date DEFAULT NULL,
  `TotalPrice` decimal(10,2) DEFAULT NULL,
  PRIMARY KEY (`OrderID`),
  KEY `GuestID` (`GuestID`),
  CONSTRAINT `orders_ibfk_1` FOREIGN KEY (`GuestID`) REFERENCES `guest` (`GuestID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `orders`
--

LOCK TABLES `orders` WRITE;
/*!40000 ALTER TABLE `orders` DISABLE KEYS */;
INSERT INTO `orders` VALUES (301,101,'2023-11-01',35.97),(302,102,'2023-11-02',25.99),(303,103,'2023-11-03',35.96);
/*!40000 ALTER TABLE `orders` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `payments`
--

DROP TABLE IF EXISTS `payments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `payments` (
  `PaymentID` int NOT NULL,
  `GuestID` int DEFAULT NULL,
  `Amount` decimal(10,2) DEFAULT NULL,
  `PaymentDate` date DEFAULT NULL,
  PRIMARY KEY (`PaymentID`),
  KEY `GuestID` (`GuestID`),
  CONSTRAINT `payments_ibfk_1` FOREIGN KEY (`GuestID`) REFERENCES `guest` (`GuestID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `payments`
--

LOCK TABLES `payments` WRITE;
/*!40000 ALTER TABLE `payments` DISABLE KEYS */;
INSERT INTO `payments` VALUES (1,101,35.97,'2023-11-01'),(2,102,25.99,'2023-11-02'),(3,103,35.96,'2023-11-03');
/*!40000 ALTER TABLE `payments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `reservation`
--

DROP TABLE IF EXISTS `reservation`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `reservation` (
  `ReservationID` int NOT NULL,
  `GuestID` int DEFAULT NULL,
  `RoomID` int DEFAULT NULL,
  `CheckInDate` date DEFAULT NULL,
  `CheckOutDate` date DEFAULT NULL,
  `TotalCost` decimal(10,2) DEFAULT NULL,
  PRIMARY KEY (`ReservationID`),
  KEY `GuestID` (`GuestID`),
  KEY `RoomID` (`RoomID`),
  CONSTRAINT `reservation_ibfk_1` FOREIGN KEY (`GuestID`) REFERENCES `guest` (`GuestID`),
  CONSTRAINT `reservation_ibfk_2` FOREIGN KEY (`RoomID`) REFERENCES `room` (`RoomID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `reservation`
--

LOCK TABLES `reservation` WRITE;
/*!40000 ALTER TABLE `reservation` DISABLE KEYS */;
INSERT INTO `reservation` VALUES (1,101,1,'2023-11-01','2023-11-03',150.00),(2,102,2,'2023-11-04','2023-11-06',200.00),(3,103,3,'2023-11-07','2023-11-09',250.00);
/*!40000 ALTER TABLE `reservation` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `reservations`
--

DROP TABLE IF EXISTS `reservations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `reservations` (
  `ReservationID` int NOT NULL,
  `GuestID` int DEFAULT NULL,
  `TableNumber` int DEFAULT NULL,
  `ReservationDate` datetime DEFAULT NULL,
  PRIMARY KEY (`ReservationID`),
  KEY `GuestID` (`GuestID`),
  CONSTRAINT `reservations_ibfk_1` FOREIGN KEY (`GuestID`) REFERENCES `guest` (`GuestID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `reservations`
--

LOCK TABLES `reservations` WRITE;
/*!40000 ALTER TABLE `reservations` DISABLE KEYS */;
INSERT INTO `reservations` VALUES (1,101,1,'2023-11-01 12:00:00'),(2,102,2,'2023-11-04 13:00:00'),(3,103,3,'2023-11-07 14:00:00');
/*!40000 ALTER TABLE `reservations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `room`
--

DROP TABLE IF EXISTS `room`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `room` (
  `RoomID` int NOT NULL,
  `RoomNumber` varchar(255) DEFAULT NULL,
  `Type` varchar(255) DEFAULT NULL,
  `Description` varchar(255) DEFAULT NULL,
  `Price` decimal(10,2) DEFAULT NULL,
  `IsOccupied` tinyint(1) NOT NULL DEFAULT '0',
  PRIMARY KEY (`RoomID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `room`
--

LOCK TABLES `room` WRITE;
/*!40000 ALTER TABLE `room` DISABLE KEYS */;
INSERT INTO `room` VALUES (1,'101','Single','Single room with a single bed',80.00,0),(2,'102','Double','Double room with two beds',120.00,1),(3,'103','Suite','Luxurious suite with a view',250.00,0);
/*!40000 ALTER TABLE `room` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `room_details`
--

DROP TABLE IF EXISTS `room_details`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `room_details` (
  `RoomID` int NOT NULL AUTO_INCREMENT,
  `RoomNumber` varchar(255) NOT NULL,
  `TypeID` int NOT NULL,
  `IsOccupied` tinyint(1) NOT NULL DEFAULT '0',
  PRIMARY KEY (`RoomID`),
  KEY `TypeID` (`TypeID`),
  CONSTRAINT `room_details_ibfk_1` FOREIGN KEY (`TypeID`) REFERENCES `room_types` (`TypeID`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `room_details`
--

LOCK TABLES `room_details` WRITE;
/*!40000 ALTER TABLE `room_details` DISABLE KEYS */;
INSERT INTO `room_details` VALUES (1,'101',1,0),(2,'102',2,1),(3,'103',3,0);
/*!40000 ALTER TABLE `room_details` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `room_facilities`
--

DROP TABLE IF EXISTS `room_facilities`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `room_facilities` (
  `FacilityID` int NOT NULL AUTO_INCREMENT,
  `FacilityName` varchar(255) NOT NULL,
  `Description` text,
  PRIMARY KEY (`FacilityID`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `room_facilities`
--

LOCK TABLES `room_facilities` WRITE;
/*!40000 ALTER TABLE `room_facilities` DISABLE KEYS */;
INSERT INTO `room_facilities` VALUES (1,'Wifi','High-speed internet access'),(2,'TV','Flat-screen TV with cable channels'),(3,'AC','Air conditioning in all rooms');
/*!40000 ALTER TABLE `room_facilities` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `room_facility_mapping`
--

DROP TABLE IF EXISTS `room_facility_mapping`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `room_facility_mapping` (
  `RoomID` int NOT NULL,
  `FacilityID` int NOT NULL,
  PRIMARY KEY (`RoomID`,`FacilityID`),
  KEY `FacilityID` (`FacilityID`),
  CONSTRAINT `room_facility_mapping_ibfk_1` FOREIGN KEY (`RoomID`) REFERENCES `room_details` (`RoomID`),
  CONSTRAINT `room_facility_mapping_ibfk_2` FOREIGN KEY (`FacilityID`) REFERENCES `room_facilities` (`FacilityID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `room_facility_mapping`
--

LOCK TABLES `room_facility_mapping` WRITE;
/*!40000 ALTER TABLE `room_facility_mapping` DISABLE KEYS */;
INSERT INTO `room_facility_mapping` VALUES (1,1),(2,2),(3,3);
/*!40000 ALTER TABLE `room_facility_mapping` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `room_types`
--

DROP TABLE IF EXISTS `room_types`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `room_types` (
  `TypeID` int NOT NULL AUTO_INCREMENT,
  `TypeName` varchar(255) NOT NULL,
  `Description` text,
  `Rate` decimal(10,2) NOT NULL,
  PRIMARY KEY (`TypeID`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `room_types`
--

LOCK TABLES `room_types` WRITE;
/*!40000 ALTER TABLE `room_types` DISABLE KEYS */;
INSERT INTO `room_types` VALUES (1,'Single','Room with a single bed',80.00),(2,'Double','Room with two beds',120.00),(3,'Suite','Luxurious suite with extra amenities',250.00);
/*!40000 ALTER TABLE `room_types` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `staff`
--

DROP TABLE IF EXISTS `staff`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `staff` (
  `StaffID` int NOT NULL,
  `Name` varchar(255) DEFAULT NULL,
  `Position` varchar(255) DEFAULT NULL,
  `Email` varchar(255) DEFAULT NULL,
  `Phone` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`StaffID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `staff`
--

LOCK TABLES `staff` WRITE;
/*!40000 ALTER TABLE `staff` DISABLE KEYS */;
INSERT INTO `staff` VALUES (1,'Michael Johnson','Manager','michael.johnson@example.com','1234567890'),(2,'Emma Williams','Receptionist','emma.williams@example.com','9876543210'),(3,'Chris Brown','Housekeeping','chris.brown@example.com','4567891230');
/*!40000 ALTER TABLE `staff` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2023-11-01 15:44:11
