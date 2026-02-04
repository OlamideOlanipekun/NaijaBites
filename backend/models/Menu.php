<?php
// backend/models/Menu.php
class Menu {
    private $conn;
    private $table_name = "dishes";

    public $id;
    public $name;
    public $price;
    public $category_id;
    public $description;
    public $image_url;
    public $is_chef_special;
    public $tags; // JSON string

    public function __construct($db) {
        $this->conn = $db;
    }

    public function read($category = null, $search = null) {
        $query = "SELECT d.id, d.name, d.price, d.description, d.image_url, d.is_chef_special, d.tags, c.name as category_name 
                  FROM " . $this->table_name . " d
                  LEFT JOIN categories c ON d.category_id = c.id
                  WHERE 1=1";
        
        // Add category filter
        if ($category && $category !== 'All') {
            $query .= " AND c.name = :category";
        }
        
        // Add search filter
        if ($search) {
            $query .= " AND (d.name LIKE :search OR d.description LIKE :search)";
        }
        
        $query .= " ORDER BY d.category_id ASC, d.name ASC";
        
        $stmt = $this->conn->prepare($query);
        
        // Bind parameters
        if ($category && $category !== 'All') {
            $stmt->bindParam(':category', $category);
        }
        
        if ($search) {
            $searchTerm = "%$search%";
            $stmt->bindParam(':search', $searchTerm);
        }
        
        $stmt->execute();
        return $stmt;
    }

    public function create() {
        $query = "INSERT INTO " . $this->table_name . " 
                  SET name=:name, price=:price, category_id=:category_id, description=:description, image_url=:image_url, is_chef_special=:is_chef_special, tags=:tags";
        
        $stmt = $this->conn->prepare($query);

        // Sanitize
        $this->name = htmlspecialchars(strip_tags($this->name));
        $this->description = htmlspecialchars(strip_tags($this->description));

        // Bind
        $stmt->bindParam(":name", $this->name);
        $stmt->bindParam(":price", $this->price);
        $stmt->bindParam(":category_id", $this->category_id);
        $stmt->bindParam(":description", $this->description);
        $stmt->bindParam(":image_url", $this->image_url);
        $stmt->bindParam(":is_chef_special", $this->is_chef_special);
        $stmt->bindParam(":tags", $this->tags);

        if ($stmt->execute()) {
            return true;
        }
        return false;
    }
}
?>
