<?php
// backend/api/public/contact.php
require_once '../../config/cors.php';
require_once '../../config/database.php';
require_once '../../models/Contact.php';
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
    
    // Get request body
    $data = getRequestBody();
    
    // Validate required fields
    $errors = [];
    
    if (!isset($data->name) || !Validator::required($data->name)) {
        $errors['name'] = 'Name is required';
    }
    
    if (!isset($data->email) || !Validator::email($data->email)) {
        $errors['email'] = 'Valid email is required';
    }
    
    if (!isset($data->subject) || !Validator::required($data->subject)) {
        $errors['subject'] = 'Subject is required';
    }
    
    if (!isset($data->message) || !Validator::required($data->message)) {
        $errors['message'] = 'Message is required';
    }
    
    if (!empty($errors)) {
        Response::validationError($errors);
    }
    
    // Create contact message
    $contact = new Contact($db);
    
    require_once '../../utils/IpHelper.php';

    // ... inside try block ...
    
    $contact->name = $data->name;
    $contact->email = $data->email;
    $contact->subject = $data->subject;
    $contact->message = $data->message;
    $contact->ip_address = IpHelper::getClientIp();
    
    if ($contact->create()) {
        Logger::info("Contact message received from: {$data->email}");
        
        // TODO: Send email notification to admin
        
        Response::success("Thank you for reaching out! We'll get back to you soon.", null, 201);
    } else {
        Logger::error("Failed to save contact message from: {$data->email}");
        Response::serverError("Failed to submit contact form");
    }
    
} catch (Exception $e) {
    Logger::error("Contact API Error: " . $e->getMessage());
    Response::serverError("An error occurred while submitting contact form");
}
?>
