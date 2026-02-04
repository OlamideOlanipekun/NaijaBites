<?php
// backend/api/admin/upload_image.php
require_once '../../config/cors.php';
require_once '../../middleware/AuthMiddleware.php';
require_once '../../utils/Response.php';

// Debug Logging
function debug_log($message) {
    $logFile = __DIR__ . '/../../logs/upload.log';
    $timestamp = date('Y-m-d H:i:s');
    file_put_contents($logFile, "[$timestamp] $message\n", FILE_APPEND);
}

debug_log("Upload request started.");

// Only allow POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    debug_log("Method not allowed: " . $_SERVER['REQUEST_METHOD']);
    Response::error("Method not allowed", 405);
}

// Authenticate request
try {
    $user = AuthMiddleware::authenticate();
    debug_log("User authenticated: " . json_encode($user));
} catch (Exception $e) {
    debug_log("Auth failed: " . $e->getMessage());
    Response::unauthorized("Authentication failed");
}

// Check if file was uploaded
if (!isset($_FILES['image']) || $_FILES['image']['error'] !== UPLOAD_ERR_OK) {
    $error = isset($_FILES['image']['error']) ? $_FILES['image']['error'] : 'No file content';
    debug_log("File upload error code: $error");
    Response::error("No image uploaded or upload error (Code: $error)");
}

$file = $_FILES['image'];
debug_log("File received: " . $file['name'] . " (Size: " . $file['size'] . ")");

$allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];
$maxSize = 20 * 1024 * 1024; // 20MB

// Validate type
$finfo = finfo_open(FILEINFO_MIME_TYPE);
$mimeType = finfo_file($finfo, $file['tmp_name']);
finfo_close($finfo);

debug_log("File Mime Type: $mimeType");

if (!in_array($mimeType, $allowedTypes)) {
    debug_log("Invalid mime type");
    Response::error("Invalid file type. Only JPG, PNG, and WEBP allowed.");
}

// Validate size
if ($file['size'] > $maxSize) {
    debug_log("File too large");
    Response::error("File too large. Max size is 20MB.");
}

// Generate unique filename
$extension = pathinfo($file['name'], PATHINFO_EXTENSION);
$filename = uniqid('dish_') . '_' . time() . '.' . $extension;

$uploadDir = __DIR__ . '/../../../public/uploads/dishes/';
$targetPath = $uploadDir . $filename;

debug_log("Target path: $targetPath");

// Create directory if not exists
if (!is_dir($uploadDir)) {
    debug_log("Creating directory...");
    if (!mkdir($uploadDir, 0777, true)) {
        debug_log("Failed to create directory");
        Response::error("Failed to create upload directory");
    }
}

if (move_uploaded_file($file['tmp_name'], $targetPath)) {
    $publicUrl = '/uploads/dishes/' . $filename;
    debug_log("Upload successful. URL: $publicUrl");
    Response::success("Image uploaded successfully", ['url' => $publicUrl]);
} else {
    debug_log("move_uploaded_file failed.");
    Response::error("Failed to save uploaded file");
}
?>
