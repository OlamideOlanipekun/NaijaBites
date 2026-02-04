<?php
// backend/api/public/gallery.php
require_once '../../config/cors.php';
require_once '../../config/database.php';
require_once '../../utils/Response.php';

try {
    if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
        Response::error("Method not allowed", 405);
    }

    $database = new Database();
    $db = $database->getConnection();

    $category = isset($_GET['category']) && $_GET['category'] !== 'All' ? $_GET['category'] : null;

    $query = "SELECT id, url, caption, category FROM gallery_images";
    if ($category) {
        $query .= " WHERE category = :category";
    }
    $query .= " ORDER BY sort_order ASC, created_at DESC";

    $stmt = $db->prepare($query);
    if ($category) {
        $stmt->bindParam(':category', $category);
    }
    $stmt->execute();
    $images = $stmt->fetchAll(PDO::FETCH_ASSOC);

    Response::success("Gallery images retrieved", $images);

} catch (Exception $e) {
    Response::error("Failed to fetch gallery: " . $e->getMessage());
}
?>
