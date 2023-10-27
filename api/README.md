# Express.js API for HARCT

This is an Express.js API designed for a hotel management and Restaurant Core system that me and my classmates are developing for our paper. It interacts with a MySQL database to perform CRUD (Create, Read, Update, Delete) operations on different entities including Guest, Room, Reservation, Staff, Orders, MenuItems, OrderItems, Payments, and Feedback.

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

- **GET /allData** Retrieve all data from all tables in the database.
---
- **POST /feedback** Create a new feedback.
- **DELETE/feedback/:feedbackID** Delete a feedback.
- **GET /feedback** Retrieve all feedbacks.
- **GET /feedback/:feedbackID** Retrieve all information about a feedback.
- **PUT /feedback/:feedbackID** Update a feedback.
---

- **POST /guest** Create a new guest.
- **DELETE/guest/:guestID** Delete a guest.
- **GET /guests** Retrieve all guests.
- **GET /guests/:guestID** Retrieve all information about a guest.
- **PUT /guests/:guestID** Update a guest.
---
- **POST /menuItems** Create a new menu item.
- **DELETE/menuItems/:menuItemsID** Delete a menu item.
- **GET /menuItems** Retrieve all menu items.
- **GET /menuItems/:menuItemsID** Retrieve all information about a menu item.
- **PUT /menuItems/:menuItemsID** Update a menu item.
---
- **POST /order** Create a new order.
- **DELETE/order/:orderID** Delete an order.
- **GET /order** Retrieve all orders.
- **GET /order/:orderID** Retrieve all information about an order.
- **PUT /order/:orderID** Update an order.
---
- **POST /orderItem** Create a new order item.
- **DELETE/orderItem/:orderItemID** Delete an order item.
- **GET /orderItem** Retrieve all order items.
- **GET /orderItem/:orderItemID** Retrieve all information about an order item.
- **PUT /orderItem/:orderItemID** Update an order item.
---
- **POST /payment** Create a new payment.
- **DELETE/payment/:paymentID** Delete a payment.
- **GET /payment** Retrieve all payments.
- **GET /payment/:paymentID** Retrieve all information about a payment.
- **PUT /payment/:paymentID** Update a payment.
---
- **POST /reservation** Create a new reservation.
- **DELETE/reservation/:reservationID** Delete a reservation.
- **GET /reservation** Retrieve all reservations.
- **GET /reservation/:reservationID** Retrieve all information about a reservation.
- **GET /reservation/guest/:guestID** Retrieve all reservations of a guest.
- **PUT /reservation/:reservationID** Update a reservation.
---
- **POST /room** Create a new room.
- **DELETE/room/:roomID** Delete a room.
- **GET /room** Retrieve all rooms. 
- **GET /room/available** Retrieve all available rooms.
- **GET /room/unavailable** Retrieve all unavailable rooms.
- **GET /room/:roomID** Retrieve all information about a room.
- **PUT /room/:roomID** Update a room.
- **PUT /room/:roomID/available** Update a room's availability.
- **PUT /room/:roomID/unavailable** Update a room's availability.
---
- **POST /staff** Create a new staff.
- **DELETE/staff/:staffID** Delete a staff.
- **GET /staff** Retrieve all staffs.
- **GET /staff/:staffID** Retrieve all information about a staff.
- **PUT /staff/:staffID** Update a staff.
---


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

#### Javascript
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

Make sure to handle any potential errors and exceptions that may occur during the HTTP requests. Adjust the URLs and data payload based on your specific API endpoint and the required parameters.

In this example, replace `'YOUR_API_KEY'` with the actual API key you have generated. Adjust the `apiUrl` variable to match the specific endpoint you want to access. Make sure to install the `axios` library if you haven't already by running `npm install axios`.

Ensure that the `x-api-key` header is included in the request with the correct API key value, and the server will use the `authenticateApiKey` middleware to validate the API key before processing the request.

#### PHP

To use the API and API key in PHP, you can make use of the `cURL` library to send HTTP requests to the API. Here's an example of how you can use the API and API key in PHP:

```php
<?php

$apiKey = "YOUR_API_KEY_HERE"; // Replace with your actual API key
$apiUrl = "http://localhost:3000/api"; // Replace with your API URL

// Function to make a GET request
function getRequest($url, $apiKey) {
    $ch = curl_init();

    // Set the URL and other options
    curl_setopt($ch, CURLOPT_URL, $url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_HTTPHEADER, array(
        'x-api-key: ' . $apiKey
    ));

    // Execute the cURL session
    $response = curl_exec($ch);

    // Close cURL session
    curl_close($ch);

    return $response;
}

// Function to make a POST request
function postRequest($url, $data, $apiKey) {
    $ch = curl_init();

    // Set the URL and other options
    curl_setopt($ch, CURLOPT_URL, $url);
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_POSTFIELDS, $data);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_HTTPHEADER, array(
        'x-api-key: ' . $apiKey
    ));

    // Execute the cURL session
    $response = curl_exec($ch);

    // Close cURL session
    curl_close($ch);

    return $response;
}

// Example usage of GET request
$response = getRequest($apiUrl, $apiKey);
echo $response;

// Example usage of POST request
$data = array(
    'name' => 'John Doe',
    'email' => 'johndoe@example.com'
);
$postResponse = postRequest($apiUrl, $data, $apiKey);
echo $postResponse;

?>
```

### Security

Ensure that you still handle input validation and prevent SQL injection attacks by using parameterized queries.

## Contributing

Contributions are welcome. Feel free to open an issue or submit a pull request.

## License

This project is licensed under the [MIT License](https://opensource.org/licenses/MIT).
