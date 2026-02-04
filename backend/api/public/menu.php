<?php
// backend/api/public/menu.php
require_once '../../config/cors.php';
require_once '../../config/database.php';
require_once '../../models/Menu.php';
require_once '../../utils/Response.php';

try {
    $database = new Database();
    $db = $database->getConnection();
    
    if (!$db) {
        Response::serverError("Database connection failed");
    }
    
    $menu = new Menu($db);
    
    // Get query parameters for filtering
    $category = isset($_GET['category']) ? $_GET['category'] : null;
    $search = isset($_GET['search']) ? $_GET['search'] : null;
    
    $stmt = $menu->read($category, $search);
    $num = $stmt->rowCount();
    
    if($num > 0) {
        $menu_arr = array();
        
        while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
            extract($row);
            
            $item = array(
                "id" => $id,
                "name" => $name,
                "price" => (float)$price,
                "description" => $description,
                "category" => $category_name,
                "image" => $image_url,
                "tags" => json_decode($tags),
                "isChefSpecial" => (bool)$is_chef_special
            );
            
            array_push($menu_arr, $item);
        }
        
        Response::success("Menu items retrieved successfully", $menu_arr);
    } else {
        Response::success("No menu items found", []);
    }
    
} catch (Exception $e) {
    error_log("Menu API Error: " . $e->getMessage());
    Response::serverError("Failed to retrieve menu items");
}
?>
