<?php
// backend/api/admin/testimonials.php
require_once '../../config/cors.php';
require_once '../../middleware/AuthMiddleware.php';
require_once '../../models/Testimonial.php';
require_once '../../utils/Response.php';
require_once '../../utils/IpHelper.php';

// Authenticate admin
try {
    $user = AuthMiddleware::authenticate();
} catch (Exception $e) {
    Response::unauthorized("Authentication failed");
}

$testimonial = new Testimonial();
$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {
    case 'GET':
        try {
            $data = $testimonial->getAll();
            Response::success("Testimonials retrieved", $data);
        } catch (Exception $e) {
            Response::error("Failed to fetch testimonials: " . $e->getMessage(), 500);
        }
        break;

    case 'POST':
        $input = json_decode(file_get_contents("php://input"), true);
        
        if (!isset($input['name']) || !isset($input['content'])) {
            Response::error("Name and content are required");
        }
        
        try {
            $ip = IpHelper::getClientIp();
            if ($testimonial->create($input, $ip)) {
                Response::success("Testimonial created successfully");
            } else {
                Response::error("Failed to create testimonial");
            }
        } catch (Exception $e) {
            Response::error("Server error: " . $e->getMessage(), 500);
        }
        break;

    case 'PUT':
        $input = json_decode(file_get_contents("php://input"), true);
        
        if (isset($input['toggle_status']) && isset($input['id'])) {
            // Toggle Status Logic
            if ($testimonial->toggleStatus($input['id'])) {
                Response::success("Status updated");
            } else {
                Response::error("Failed to update status");
            }
        } elseif (isset($input['id'])) {
            // Full Update Logic
            if ($testimonial->update($input['id'], $input)) {
                Response::success("Testimonial updated successfully");
            } else {
                Response::error("Failed to update testimonial");
            }
        } else {
            Response::error("ID required");
        }
        break;

    case 'DELETE':
        $id = isset($_GET['id']) ? (int)$_GET['id'] : null;
        
        if (!$id) {
            Response::error("ID required");
        }
        
        try {
            if ($testimonial->delete($id)) {
                Response::success("Testimonial deleted");
            } else {
                Response::error("Failed to delete testimonial");
            }
        } catch (Exception $e) {
            Response::error("Failed to delete: " . $e->getMessage(), 500);
        }
        break;

    default:
        Response::error("Method not allowed", 405);
}
?>
