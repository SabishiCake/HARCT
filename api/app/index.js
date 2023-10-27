const express = require('express');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const port = process.env.EXP_PORT || 3000;
const address = process.env.EXP_ADDR || 'localhost';

app.use(express.json());
const authenticateApiKey = require(__dirname + '/middleware/authenticateApiKey');
const logRequest = require(__dirname + '/middleware/logger');

app.use(logRequest);
const allDataRouter = require(__dirname + '/routes/allData');


const apiKeysRouter = require(__dirname + '/routes/apiKeys');
const feedbackRouter = require(__dirname + '/routes/feedback');
const guestRouter = require(__dirname + '/routes/guest');
const menuItemsRouter = require(__dirname + '/routes/menuItems');
const orderRouter = require(__dirname + '/routes/order');
const orderItemRouter = require(__dirname + '/routes/orderItems');
const paymentRouter = require(__dirname + '/routes/payment');
const reservationRouter = require(__dirname + '/routes/reservation');
const roomRouter = require(__dirname + '/routes/room');
const staffRouter = require(__dirname + '/routes/staff');

// Authentication middleware, all routes below this require an API key
// Put this after the routes that don't require authentication
app.use(authenticateApiKey);

// Routers
app.use('/allData', allDataRouter);
app.use('/apiKeys', apiKeysRouter);
app.use('/feedback', feedbackRouter);
app.use('/guest', guestRouter);
app.use('/menuItems', menuItemsRouter);
app.use('/order', orderRouter);
app.use('/orderItem', orderItemRouter);
app.use('/payment', paymentRouter);
app.use('/reservation', reservationRouter);
app.use('/room', roomRouter);
app.use('/staff', staffRouter);


app.listen(port, address, () => {
    console.log(`Server listening on http://${address}:${port}`);
    console.log(`With available endpoints:`);
    console.log(`http://${address}:${port}/guest`);
    console.log(`http://${address}:${port}/room`);

    console.log('Press Ctrl+C to quit.');
});