<?php
require_once __DIR__ . "/router/index.php";

//$uri = $_SERVER['REQUEST_URI'];

$Router = new Router;

$Router->handle('GET', '/', 'controller/index.controller.php');

$Router->handle('GET', '/guest', 'controller/guest.controller.php');

$Router->handle('GET', '/booking', 'controller/booking.controller.php');

$Router->handle('GET', '/room', 'controller/room.controller.php');

$Router->handle('GET', '/billing', 'controller/billing.controller.php');

$Router->handle('GET', '/order', 'controller/order.controller.php');

$Router->handle('GET', '/food', 'controller/food.controller.php');

$Router->handle('GET', '/inventory', 'controller/inventory.controller.php');
