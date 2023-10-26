USE harctmydb;

-- Insert into Guest table
INSERT INTO Guest (GuestID, LastName, FirstName, Email, Phone, Address) VALUES 
(1, 'Doe', 'John', 'johndoe@example.com', '123-456-7890', '123 Main St'),
(2, 'Smith', 'Jane', 'janesmith@example.com', '987-654-3210', '456 Broadway Ave');

-- Insert into Room table
INSERT INTO Room (RoomID, RoomNumber, Type, Description, Price) VALUES 
(1, '101', 'Single', 'Standard single room', 100.00),
(2, '201', 'Double', 'Standard double room', 150.00);

-- Insert into Reservation table
INSERT INTO Reservation (ReservationID, GuestID, RoomID, CheckInDate, CheckOutDate, TotalCost) VALUES 
(1, 1, 1, '2023-10-20', '2023-10-25', 500.00),
(2, 2, 2, '2023-11-01', '2023-11-05', 600.00);

-- Insert into Staff table
INSERT INTO Staff (StaffID, Name, Position, Email, Phone) VALUES 
(1, 'Michael Johnson', 'Manager', 'michael@example.com', '111-222-3333'),
(2, 'Emily Williams', 'Receptionist', 'emily@example.com', '444-555-6666');

-- Insert into Orders table
INSERT INTO Orders (OrderID, GuestID, OrderDate, TotalPrice) VALUES 
(1, 1, '2023-10-22', 50.00),
(2, 2, '2023-11-03', 70.00);

-- Insert into MenuItems table
INSERT INTO MenuItems (ItemID, Name, Description, Price) VALUES 
(1, 'Burger', 'Juicy beef burger with cheese', 10.00),
(2, 'Pasta', 'Spaghetti with marinara sauce', 12.00);

-- Insert into OrderItems table
INSERT INTO OrderItems (OrderItemID, OrderID, ItemID, Quantity) VALUES 
(1, 1, 1, 2),
(2, 2, 2, 1);

-- Insert into Payments table
INSERT INTO Payments (PaymentID, GuestID, Amount, PaymentDate) VALUES 
(1, 1, 500.00, '2023-10-25'),
(2, 2, 600.00, '2023-11-05');

-- Insert into Feedback table
INSERT INTO Feedback (FeedbackID, GuestID, Comment, Rating) VALUES 
(1, 1, 'Great experience overall', 5),
(2, 2, 'Could improve the breakfast options', 4);

