# Express.js API for Hotel Management

This is an Express.js API designed for a hotel management system. It interacts with a MySQL database to perform CRUD (Create, Read, Update, Delete) operations on different entities including Guest, Room, Reservation, Staff, Orders, MenuItems, OrderItems, Payments, and Feedback.

## Getting Started

### Prerequisites

- Node.js
- MySQL

### Installation

1. Clone the repository.
2. Install dependencies using the following command:
3. Set up your MySQL database and update the database connection details in the `app.js` file.

### Usage

Start the server using the following command:


The server will be running on `http://localhost:3000`.

### Available Routes

- **POST /guest:** Create a new guest.
- **GET /guests:** Retrieve all guests.
- Add more routes for other entities as needed.

### Database Schema

The API is designed to work with the following database schema:

- Guest
- Room
- Reservation
- Staff
- Orders
- MenuItems
- OrderItems
- Payments
- Feedback

Make sure to set up your database according to the provided schema.

### Security

Ensure that you handle input validation and prevent SQL injection attacks by using parameterized queries.

## Contributing

Contributions are welcome. Feel free to open an issue or submit a pull request.

## License

This project is licensed under the [MIT License](https://opensource.org/licenses/MIT).
