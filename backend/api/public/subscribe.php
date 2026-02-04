<?php
// backend/api/public/subscribe.php
require_once '../../config/cors.php';
require_once '../../models/Subscriber.php';
require_once '../../utils/Response.php';
require_once '../../utils/IpHelper.php';

// Only allow POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    Response::error("Method not allowed", 405);
}

// Get input
$input = json_decode(file_get_contents("php://input"), true);

if (!isset($input['email']) || empty(trim($input['email']))) {
    Response::error("Email is required");
}

$email = filter_var(trim($input['email']), FILTER_VALIDATE_EMAIL);

if (!$email) {
    Response::error("Invalid email format");
}

try {
    $subscriber = new Subscriber();
    $ip = IpHelper::getClientIp();
    $result = $subscriber->subscribe($email, $ip);
    
    if ($result['success']) {
        Response::success($result['message']);
    } else {
        Response::error($result['message']);
    }
} catch (Exception $e) {
    Response::error("Subscription failed: " . $e->getMessage(), 500);
}
?>
