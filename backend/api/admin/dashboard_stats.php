<?php
// backend/api/admin/dashboard_stats.php
require_once '../../config/cors.php';
require_once '../../config/database.php';
require_once '../../middleware/AuthMiddleware.php';
require_once '../../utils/Response.php';

// Only allow GET
if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    Response::error("Method not allowed", 405);
}

// Authenticate request
$user = AuthMiddleware::authenticate();

try {
    $database = new Database();
    $db = $database->getConnection();
    
    if (!$db) {
        Response::serverError("Database connection failed");
    }
    
    $stats = [
        'total_orders' => 0,
        'total_revenue' => 0,
        'pending_reservations' => 0,
        'active_menu_items' => 0
    ];
    
    // 1. Total Orders
    $stmt = $db->query("SELECT COUNT(*) as count FROM orders");
    $stats['total_orders'] = $stmt->fetch(PDO::FETCH_ASSOC)['count'];
    
    // 2. Total Revenue (only paid orders)
    $stmt = $db->query("SELECT SUM(amount) as total FROM orders WHERE status = 'paid'");
    $row = $stmt->fetch(PDO::FETCH_ASSOC);
    $stats['total_revenue'] = $row['total'] ? (float)$row['total'] : 0;
    
    // 3. Pending Reservations
    $stmt = $db->query("SELECT COUNT(*) as count FROM reservations WHERE status = 'pending'");
    $stats['pending_reservations'] = $stmt->fetch(PDO::FETCH_ASSOC)['count'];
    
    // 4. Active Menu Items
    $stmt = $db->query("SELECT COUNT(*) as count FROM dishes");
    $stats['active_menu_items'] = $stmt->fetch(PDO::FETCH_ASSOC)['count'];
    
    Response::success("Dashboard stats retrieved", $stats);
    
} catch (Exception $e) {
    // Log error in production
    Response::serverError("An error occurred while fetching stats: " . $e->getMessage());
}
?>
