<?php
// backend/api/admin/messages.php
require_once '../../config/cors.php';
require_once '../../middleware/AuthMiddleware.php';
require_once '../../config/database.php';
require_once '../../models/Contact.php';
require_once '../../utils/Response.php';

// Authenticate admin
try {
    $user = AuthMiddleware::authenticate();
} catch (Exception $e) {
    Response::unauthorized("Authentication failed");
}

$database = new Database();
$db = $database->getConnection();
$contact = new Contact($db);

$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {
    case 'GET':
        try {
            $stmt = $contact->readAll();
            $messages = $stmt->fetchAll(PDO::FETCH_ASSOC);
            Response::success("Messages retrieved", $messages);
        } catch (Exception $e) {
            Response::error("Failed to fetch messages: " . $e->getMessage(), 500);
        }
        break;

    case 'PUT':
        // Mark as read
        $input = json_decode(file_get_contents("php://input"), true);
        if (!isset($input['id'])) {
            Response::error("ID required");
        }
        
        try {
            if ($contact->markAsRead($input['id'])) {
                Response::success("Message marked as read");
            } else {
                Response::error("Failed to update message");
            }
        } catch (Exception $e) {
            Response::error("Server error: " . $e->getMessage(), 500);
        }
        break;
        
    default:
        Response::error("Method not allowed", 405);
}
?>
