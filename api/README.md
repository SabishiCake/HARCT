# Express.js API for Hotel Management

This is an Express.js API designed for a hotel management system. It interacts with a MySQL database to perform CRUD (Create, Read, Update, Delete) operations on different entities including Guest, Room, Reservation, Staff, Orders, MenuItems, OrderItems, Payments, and Feedback.

## Getting Started

### Prerequisites

- Node.js
- MySQL

### Development Prerequisites (Optional)
- Postman

### Installation

1. Clone the repository.
2. Install dependencies using the following command:
```bash
npm install
```

3. create a `.env` file in the root directory of the project and add the following environment variables:

```bash
DB_HOST=localhost // your database host
DB_USER=root // your database username
DB_PASSWORD= // your database password
DB_NAME=harctmydb // your database name
```

Should look like this:

![Alt text](../api/media/Screenshot%202023-10-26%20173045.png)


4. Create a MySQL database named `harctmydb` and import the `createHarctDb_sqlScript.sql` file in the database.

# Start the server

Start the server using the following command:
```bash
npm start
```

# development
```bash
npm run dev
```

The server will be running on `http://localhost:3000`. but you still needs to check your console/terminal for the correct address.

### Available Routes

- **POST /guest** Create a new guest.
- **GET /guests** Retrieve all guests.
- **GET /guests/:id:** Retrieve all information about a guest.
- **GET /rooms** Retrieve all rooms. 
- **GET /rooms/occupied** Retrieve all available rooms.
- **GET /rooms/unoccupied** Retrieve all unavailable rooms.
- **GET /menuItems** Retrieve all menu items.
- Coming soon...

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


### API Documentation

# Authentication

first is you must generate an API key first by using the script below:

```bash
node generateApiKey.js
```
copy it and store it in a safe place.


To use the API key authentication in your requests, you need to include the API key in the headers of your requests. Here is an example of how you can make a request with API key authentication in Javascript using the `axios` library:

```javascript
const axios = require('axios');

const apiKey = 'YOUR_API_KEY';
const apiUrl = 'http://localhost:3000/guests'; // Change the URL as needed

const headers = {
  'Content-Type': 'application/json',
  'X-API-Key': apiKey,
};

// Example GET request
axios.get(apiUrl, { headers })
  .then(response => {
    console.log('Response data:', response.data);
  })
  .catch(error => {
    console.error('Error:', error.message);
  });

// Example POST request
const data = {
  LastName: 'Doe',
  FirstName: 'John',
  Email: 'johndoe@example.com',
  Phone: '1234567890',
  Address: '123 Main Street',
};

axios.post(apiUrl, data, { headers })
  .then(response => {
    console.log('Response data:', response.data);
  })
  .catch(error => {
    console.error('Error:', error.message);
  });
```

In this example, replace `'YOUR_API_KEY'` with the actual API key you have generated. Adjust the `apiUrl` variable to match the specific endpoint you want to access. Make sure to install the `axios` library if you haven't already by running `npm install axios`.

Ensure that the `x-api-key` header is included in the request with the correct API key value, and the server will use the `authenticateApiKey` middleware to validate the API key before processing the request.


### Security

Ensure that you handle input validation and prevent SQL injection attacks by using parameterized queries.

## Contributing

Contributions are welcome. Feel free to open an issue or submit a pull request.

## License

This project is licensed under the [MIT License](https://opensource.org/licenses/MIT).
