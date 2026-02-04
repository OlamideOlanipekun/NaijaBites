<?php
// backend/api/public/book_table.php
require_once '../../config/cors.php';
require_once '../../config/database.php';
require_once '../../models/Reservation.php';
require_once '../../utils/Response.php';
require_once '../../utils/helpers.php';

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
    
    $reservation = new Reservation($db);
    
    // Get request body
    $data = getRequestBody();
    
    // Validate required fields
    $errors = [];
    
    if (!isset($data->guest_name) || !Validator::required($data->guest_name)) {
        $errors['guest_name'] = 'Guest name is required';
    }
    
    if (!isset($data->phone) || !Validator::required($data->phone)) {
        $errors['phone'] = 'Phone number is required';
    }
    
    if (isset($data->guest_email) && $data->guest_email && !Validator::email($data->guest_email)) {
        $errors['guest_email'] = 'Valid email format required';
    }
    
    if (!isset($data->date) || !$data->date) {
        $errors['date'] = 'Reservation date is required';
    }
    
    if (!isset($data->time) || !$data->time) {
        $errors['time'] = 'Reservation time is required';
    }
    
    if (!isset($data->guests_count) || !Validator::positiveNumber($data->guests_count)) {
        $errors['guests_count'] = 'Number of guests must be a positive number';
    }
    
    if (!empty($errors)) {
        Response::validationError($errors);
    }
    
    // Set reservation data
    $reservation->guest_name = $data->guest_name;
    $reservation->guest_email = $data->guest_email ?? '';
    $reservation->phone = $data->phone;
    $reservation->date = $data->date;
    $reservation->time = $data->time;
    $reservation->guests_count = $data->guests_count;
    $reservation->message = $data->message ?? '';
    
    if ($reservation->create()) {
        Logger::info("Reservation created for: {$data->guest_name} on {$data->date} at {$data->time}");
        
        // TODO: Send email notification to admin and confirmation to guest
        
        Response::success("Reservation scheduled successfully! We'll contact you shortly to confirm.", null, 201);
    } else {
        Logger::error("Failed to create reservation for: {$data->guest_name}");
        Response::serverError("Unable to schedule reservation");
    }
    
} catch (Exception $e) {
    Logger::error("Reservation API Error: " . $e->getMessage());
    Response::serverError("An error occurred while scheduling reservation");
}
?>
