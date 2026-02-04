<?php
// backend/api/public/orders/create_order.php
require_once '../../../config/cors.php';
require_once '../../../config/database.php';
require_once '../../../models/Order.php';
require_once '../../../utils/Response.php';
require_once '../../../utils/helpers.php';

try {
    // Only allow POST
    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        Response::error("Method not allowed", 405);
    }

    $database = new Database();
    $db = $database->getConnection();
    
    if (!$db) {
        Response::serverError("Database connection failed");
    }
    
    // Get request body
    $data = getRequestBody();
    
    // Validate required fields
    $errors = [];
    
    if (!isset($data->customer_email) || !Validator::email($data->customer_email)) {
        $errors['customer_email'] = 'Valid email is required';
    }
    
    if (!isset($data->items) || !is_array($data->items) || count($data->items) === 0) {
        $errors['items'] = 'Order must contain at least one item';
    }
    
    if (!isset($data->total_amount) || !Validator::positiveNumber($data->total_amount)) {
        $errors['total_amount'] = 'Valid total amount is required';
    }
    
    if (!empty($errors)) {
        Response::validationError($errors);
    }
    
    // Create order
    $order = new Order($db);
    
    $order->reference = generateReference('ORD');
    $order->amount = $data->total_amount;
    $order->status = 'pending';
    $order->customer_email = Validator::sanitize($data->customer_email);
    $order->items_json = json_encode($data->items);
    
    if ($order->create()) {
        Logger::payment("Order created: {$order->reference} - Amount: {$order->amount}");
        
        Response::success("Order created successfully", [
            'reference' => $order->reference,
            'amount' => (float)$order->amount,
            'email' => $order->customer_email
        ], 201);
    } else {
        Logger::error("Failed to create order for email: {$data->customer_email}");
        Response::serverError("Failed to create order");
    }
    
} catch (Exception $e) {
    Logger::error("Create Order API Error: " . $e->getMessage());
    Response::serverError("An error occurred while creating order");
}
?>
