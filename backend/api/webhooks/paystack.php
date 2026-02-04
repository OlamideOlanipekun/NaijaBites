<?php
// backend/api/webhooks/paystack.php
http_response_code(200);

include_once '../../config/database.php';
include_once '../../models/Order.php';

// Retrieve the request's body
$input = @file_get_contents("php://input");

// Ideally verify signature here using $_SERVER['HTTP_X_PAYSTACK_SIGNATURE'] and your secret key

$event = json_decode($input);

if(!$event) {
    exit();
}

if($event->event == 'charge.success') {
    $database = new Database();
    $db = $database->getConnection();
    $order = new Order($db);

    $reference = $event->data->reference;
    $status = 'paid';

    // Update order status in DB
    $order->updateStatus($reference, $status);
}

exit();
?>
