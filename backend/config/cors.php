<?php
// backend/config/cors.php
require_once __DIR__ . '/env.php';

// Get allowed origins from environment
$allowedOrigins = [
    Env::get('FRONTEND_URL', 'http://localhost:5173'),
    'http://localhost:3000',
    'http://localhost:5173',
];

// Get the request origin
$origin = isset($_SERVER['HTTP_ORIGIN']) ? $_SERVER['HTTP_ORIGIN'] : '';

// Check if origin is allowed
if (in_array($origin, $allowedOrigins)) {
    header("Access-Control-Allow-Origin: $origin");
} else {
    // In development, allow all origins
    if (Env::get('APP_ENV', 'development') === 'development') {
        header("Access-Control-Allow-Origin: *");
    }
}

// CORS headers
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Credentials: true");

// Security headers
header("X-Content-Type-Options: nosniff");
header("X-Frame-Options: DENY");
header("X-XSS-Protection: 1; mode=block");

// Content type
header("Content-Type: application/json; charset=UTF-8");

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}
?>
