<?php
// backend/api/admin/auth/login.php
require_once '../../../config/cors.php';
require_once '../../../config/database.php';
require_once '../../../core/Auth.php';
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
    if (!isset($data->username) || !isset($data->password)) {
        Response::error("Username and password are required", 400);
    }
    
    $auth = new Auth($db);
    
    $result = $auth->login($data->username, $data->password);
    
    if ($result['status']) {
        Logger::info("Admin login successful: {$data->username}");
        
        Response::success("Login successful", [
            'token' => $result['token'],
            'user' => $result['user']
        ]);
    } else {
        Logger::info("Failed login attempt for username: {$data->username}");
        
        Response::unauthorized($result['message'] ?? "Invalid credentials");
    }
    
} catch (Exception $e) {
    Logger::error("Login API Error: " . $e->getMessage());
    Response::serverError("An error occurred during login");
}
?>
