CREATE DATABASE harctmydb;
USE harctmydb;

CREATE TABLE Guest (
    GuestID INT PRIMARY KEY,
    LastName VARCHAR(255),
    FirstName VARCHAR(255),
    Email VARCHAR(255),
    Phone VARCHAR(255),
    Address VARCHAR(255)
);

CREATE TABLE Room (
    RoomID INT PRIMARY KEY,
    RoomNumber VARCHAR(255),
    Type VARCHAR(255),
    Description VARCHAR(255),
    Price DECIMAL(10, 2)
);

CREATE TABLE Reservation (
    ReservationID INT PRIMARY KEY,
    GuestID INT,
    RoomID INT,
    CheckInDate DATE,
    CheckOutDate DATE,
    TotalCost DECIMAL(10, 2),
    FOREIGN KEY (GuestID) REFERENCES Guest(GuestID),
    FOREIGN KEY (RoomID) REFERENCES Room(RoomID)
);

CREATE TABLE Staff (
    StaffID INT PRIMARY KEY,
    Name VARCHAR(255),
    Position VARCHAR(255),
    Email VARCHAR(255),
    Phone VARCHAR(255)
);

CREATE TABLE Orders (
    OrderID INT PRIMARY KEY,
    GuestID INT,
    OrderDate DATE,
    TotalPrice DECIMAL(10, 2),
    FOREIGN KEY (GuestID) REFERENCES Guest(GuestID)
);

CREATE TABLE MenuItems (
    ItemID INT PRIMARY KEY,
    Name VARCHAR(255),
    Description VARCHAR(255),
    Price DECIMAL(10, 2)
);

CREATE TABLE OrderItems (
    OrderItemID INT PRIMARY KEY,
    OrderID INT,
    ItemID INT,
    Quantity INT,
    FOREIGN KEY (OrderID) REFERENCES Orders(OrderID),
    FOREIGN KEY (ItemID) REFERENCES MenuItems(ItemID)
);

CREATE TABLE Payments (
    PaymentID INT PRIMARY KEY,
    GuestID INT,
    Amount DECIMAL(10, 2),
    PaymentDate DATE,
    FOREIGN KEY (GuestID) REFERENCES Guest(GuestID)
);

CREATE TABLE Feedback (
    FeedbackID INT PRIMARY KEY,
    GuestID INT,
    Comment VARCHAR(255),
    Rating INT,
    FOREIGN KEY (GuestID) REFERENCES Guest(GuestID)
);

CREATE TABLE APIKeys (
    ID INT PRIMARY KEY AUTO_INCREMENT,
    APIKey VARCHAR(255),
    Description VARCHAR(255)
);
