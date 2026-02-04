<?php
// backend/api/admin/menu_operations.php
require_once '../../config/cors.php';
require_once '../../config/database.php';
require_once '../../middleware/AuthMiddleware.php';
require_once '../../utils/Response.php';
require_once '../../utils/helpers.php';

// Authenticate request
$user = AuthMiddleware::authenticate();

$database = new Database();
$db = $database->getConnection();

if (!$db) {
    Response::serverError("Database connection failed");
}

$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {
    case 'GET':
        // Fetch all dishes (admin view might need more details or raw list)
        try {
            $query = "SELECT d.*, c.name as category_name 
                      FROM dishes d 
                      LEFT JOIN categories c ON d.category_id = c.id 
                      ORDER BY d.created_at DESC";
            $stmt = $db->prepare($query);
            $stmt->execute();
            $dishes = $stmt->fetchAll(PDO::FETCH_ASSOC);
            
            // Decode tags JSON
            foreach ($dishes as &$dish) {
                if (isset($dish['tags'])) {
                    $dish['tags'] = json_decode($dish['tags']);
                }
            }
            
            Response::success("Menu items retrieved", $dishes);
        } catch (Exception $e) {
            Response::serverError("Failed to fetch menu: " . $e->getMessage());
        }
        break;

    case 'POST':
        // Create new dish
        $data = getRequestBody();
        
        if (!isset($data->name) || !isset($data->price) || !isset($data->category_id)) {
            Response::error("Missing required fields: name, price, category_id", 400);
        }
        
        try {
            $query = "INSERT INTO dishes (name, description, price, category_id, image_url, is_chef_special, tags) 
                      VALUES (:name, :description, :price, :category_id, :image_url, :is_chef_special, :tags)";
            $stmt = $db->prepare($query);
            
            $stmt->bindParam(':name', $data->name);
            $stmt->bindParam(':description', $data->description);
            $stmt->bindParam(':price', $data->price);
            $stmt->bindParam(':category_id', $data->category_id);
            $stmt->bindParam(':image_url', $data->image_url);
            $is_chef_special = isset($data->is_chef_special) ? (int)$data->is_chef_special : 0;
            $stmt->bindParam(':is_chef_special', $is_chef_special, PDO::PARAM_INT);
            $tags = isset($data->tags) ? json_encode($data->tags) : null;
            $stmt->bindParam(':tags', $tags);
            
            if ($stmt->execute()) {
                Response::success("Dish created successfully", ['id' => $db->lastInsertId()], 201);
            } else {
                Response::error("Failed to create dish");
            }
        } catch (Exception $e) {
            Response::serverError("Create error: " . $e->getMessage());
        }
        break;

    case 'PUT':
        // Update existing dish
        $data = getRequestBody();
        
        if (!isset($data->id)) {
            Response::error("Dish ID is required for update", 400);
        }
        
        try {
            $query = "UPDATE dishes 
                      SET name = :name, 
                          description = :description, 
                          price = :price, 
                          category_id = :category_id, 
                          image_url = :image_url, 
                          is_chef_special = :is_chef_special, 
                          tags = :tags 
                      WHERE id = :id";
            $stmt = $db->prepare($query);
            
            $stmt->bindParam(':name', $data->name);
            $stmt->bindParam(':description', $data->description);
            $stmt->bindParam(':price', $data->price);
            $stmt->bindParam(':category_id', $data->category_id);
            $stmt->bindParam(':image_url', $data->image_url);
            $is_chef_special = isset($data->is_chef_special) ? (int)$data->is_chef_special : 0;
            $stmt->bindParam(':is_chef_special', $is_chef_special, PDO::PARAM_INT);
            $tags = isset($data->tags) ? json_encode($data->tags) : null;
            $stmt->bindParam(':tags', $tags);
            $stmt->bindParam(':id', $data->id);
            
            if ($stmt->execute()) {
                Response::success("Dish updated successfully");
            } else {
                Response::error("Failed to update dish");
            }
        } catch (Exception $e) {
            Response::serverError("Update error: " . $e->getMessage());
        }
        break;

    case 'DELETE':
        // Delete dish
        // Allow ID passed via query string or body
        $id = isset($_GET['id']) ? $_GET['id'] : (isset($data->id) ? $data->id : null);
        
        if (!$id) {
             Response::error("Dish ID is required", 400);
        }
        
        try {
            $query = "DELETE FROM dishes WHERE id = :id";
            $stmt = $db->prepare($query);
            $stmt->bindParam(':id', $id);
            
            if ($stmt->execute()) {
                Response::success("Dish deleted successfully");
            } else {
                Response::error("Failed to delete dish");
            }
        } catch (Exception $e) {
            Response::serverError("Delete error: " . $e->getMessage());
        }
        break;

    default:
        Response::error("Method not allowed", 405);
        break;
}
?>
