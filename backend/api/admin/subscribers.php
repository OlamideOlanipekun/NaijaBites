<?php
// backend/api/admin/subscribers.php
require_once '../../config/cors.php';
require_once '../../middleware/AuthMiddleware.php';
require_once '../../models/Subscriber.php';
require_once '../../utils/Response.php';

// Authenticate admin
try {
    $user = AuthMiddleware::authenticate();
} catch (Exception $e) {
    Response::unauthorized("Authentication failed");
}

$subscriber = new Subscriber();
$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {
    case 'GET':
        // Get all subscribers
        try {
            $subscribers = $subscriber->getAll();
            $counts = $subscriber->getCount();
            Response::success("Subscribers retrieved", [
                'subscribers' => $subscribers,
                'total' => (int)$counts['total'],
                'active' => (int)$counts['active']
            ]);
        } catch (Exception $e) {
            Response::error("Failed to fetch subscribers: " . $e->getMessage(), 500);
        }
        break;

    case 'PUT':
        // Toggle subscriber status
        $input = json_decode(file_get_contents("php://input"), true);
        
        if (!isset($input['id'])) {
            Response::error("Subscriber ID required");
        }
        
        try {
            $subscriber->toggleStatus($input['id']);
            Response::success("Status updated");
        } catch (Exception $e) {
            Response::error("Failed to update status: " . $e->getMessage(), 500);
        }
        break;

    case 'DELETE':
        // Delete subscriber
        $id = isset($_GET['id']) ? (int)$_GET['id'] : null;
        
        if (!$id) {
            Response::error("Subscriber ID required");
        }
        
        try {
            $subscriber->delete($id);
            Response::success("Subscriber deleted");
        } catch (Exception $e) {
            Response::error("Failed to delete subscriber: " . $e->getMessage(), 500);
        }
        break;

    case 'POST':
        // Bulk email (placeholder - requires SMTP setup)
        $input = json_decode(file_get_contents("php://input"), true);
        
        if (!isset($input['subject']) || !isset($input['message'])) {
            Response::error("Subject and message required");
        }
        
        try {
            $emails = $subscriber->getActiveEmails();
            
            // For now, just return the count - actual email sending requires SMTP config
            Response::success("Email would be sent to " . count($emails) . " subscribers", [
                'count' => count($emails),
                'note' => 'SMTP not configured - implement mail sending in production'
            ]);
        } catch (Exception $e) {
            Response::error("Failed to send emails: " . $e->getMessage(), 500);
        }
        break;

    default:
        Response::error("Method not allowed", 405);
}
?>
