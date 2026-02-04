<?php
// backend/api/admin/gallery.php
require_once '../../config/cors.php';
require_once '../../middleware/AuthMiddleware.php';
require_once '../../utils/Response.php';
require_once '../../config/database.php';

// Authenticate request
$user = AuthMiddleware::authenticate();

$database = new Database();
$db = $database->getConnection();

$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {
    case 'GET':
        try {
            $query = "SELECT * FROM gallery_images ORDER BY sort_order ASC, created_at DESC";
            $stmt = $db->prepare($query);
            $stmt->execute();
            $images = $stmt->fetchAll(PDO::FETCH_ASSOC);
            
            Response::success("Gallery images retrieved", $images);
        } catch (PDOException $e) {
            Response::error("Database error: " . $e->getMessage());
        }
        break;

    case 'POST':
        $data = json_decode(file_get_contents("php://input"));
        
        if (!isset($data->url) || !isset($data->caption) || !isset($data->category)) {
            Response::error("Missing required fields: url, caption, category");
        }

        $validCategories = ['Cuisine', 'Ambiance', 'Culture'];
        if (!in_array($data->category, $validCategories)) {
            Response::error("Invalid category");
        }

        try {
            $query = "INSERT INTO gallery_images (url, caption, category, sort_order) VALUES (:url, :caption, :category, :sort_order)";
            $stmt = $db->prepare($query);
            $stmt->bindParam(':url', $data->url);
            $stmt->bindParam(':caption', $data->caption);
            $stmt->bindParam(':category', $data->category);
            $sortOrder = isset($data->sort_order) ? $data->sort_order : 0;
            $stmt->bindParam(':sort_order', $sortOrder);

            if ($stmt->execute()) {
                Response::success("Gallery image added successfully", ['id' => $db->lastInsertId()], 201);
            } else {
                Response::error("Failed to add gallery image");
            }
        } catch (PDOException $e) {
            Response::error("Database error: " . $e->getMessage());
        }
        break;

    case 'PUT':
        $data = json_decode(file_get_contents("php://input"));
        
        if (!isset($data->id)) {
            Response::error("Missing image ID");
        }

        try {
            $query = "UPDATE gallery_images SET url = :url, caption = :caption, category = :category, sort_order = :sort_order WHERE id = :id";
            $stmt = $db->prepare($query);
            $stmt->bindParam(':url', $data->url);
            $stmt->bindParam(':caption', $data->caption);
            $stmt->bindParam(':category', $data->category);
            $stmt->bindParam(':sort_order', $data->sort_order);
            $stmt->bindParam(':id', $data->id);

            if ($stmt->execute()) {
                Response::success("Gallery image updated successfully");
            } else {
                Response::error("Failed to update gallery image");
            }
        } catch (PDOException $e) {
            Response::error("Database error: " . $e->getMessage());
        }
        break;

    case 'DELETE':
        $id = isset($_GET['id']) ? $_GET['id'] : null;
        
        if (!$id) {
            Response::error("Missing image ID");
        }

        try {
            $query = "DELETE FROM gallery_images WHERE id = :id";
            $stmt = $db->prepare($query);
            $stmt->bindParam(':id', $id);

            if ($stmt->execute()) {
                Response::success("Gallery image deleted successfully");
            } else {
                Response::error("Failed to delete gallery image");
            }
        } catch (PDOException $e) {
            Response::error("Database error: " . $e->getMessage());
        }
        break;

    default:
        Response::error("Method not allowed", 405);
        break;
}
?>
