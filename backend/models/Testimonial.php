<?php
// backend/models/Testimonial.php
require_once __DIR__ . '/../config/database.php';

class Testimonial {
    private $conn;

    public function __construct() {
        $database = new Database();
        $this->conn = $database->getConnection();
    }

    /**
     * Get all active testimonials (public)
     */
    public function getActive() {
        $query = "SELECT * FROM testimonials WHERE is_active = 1 ORDER BY created_at DESC";
        $stmt = $this->conn->prepare($query);
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    /**
     * Get all testimonials (admin)
     */
    public function getAll() {
        $query = "SELECT *, ip_address FROM testimonials ORDER BY created_at DESC";
        $stmt = $this->conn->prepare($query);
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    /**
     * Add new testimonial
     */
    public function create($data, $ip = null) {
        $query = "INSERT INTO testimonials (name, role, content, rating, avatar_url, is_active, ip_address) 
                  VALUES (:name, :role, :content, :rating, :avatar_url, :is_active, :ip_address)";
        
        $stmt = $this->conn->prepare($query);
        
        // Clean data
        $name = htmlspecialchars(strip_tags($data['name']));
        $role = htmlspecialchars(strip_tags($data['role']));
        $content = htmlspecialchars(strip_tags($data['content']));
        $rating = (int)$data['rating'];
        $avatar_url = htmlspecialchars(strip_tags($data['avatar_url']));
        $is_active = isset($data['is_active']) ? (int)$data['is_active'] : 1;

        $stmt->bindParam(':name', $name);
        $stmt->bindParam(':role', $role);
        $stmt->bindParam(':content', $content);
        $stmt->bindParam(':rating', $rating);
        $stmt->bindParam(':avatar_url', $avatar_url);
        $stmt->bindParam(':is_active', $is_active);
        $stmt->bindParam(':ip_address', $ip);

        if ($stmt->execute()) {
            return true;
        }
        return false;
    }

    /**
     * Update testimonial
     */
    public function update($id, $data) {
        $query = "UPDATE testimonials SET 
                    name = :name, 
                    role = :role, 
                    content = :content, 
                    rating = :rating, 
                    avatar_url = :avatar_url, 
                    is_active = :is_active 
                  WHERE id = :id";
        
        $stmt = $this->conn->prepare($query);
        
        $name = htmlspecialchars(strip_tags($data['name']));
        $role = htmlspecialchars(strip_tags($data['role']));
        $content = htmlspecialchars(strip_tags($data['content']));
        $rating = (int)$data['rating'];
        $avatar_url = htmlspecialchars(strip_tags($data['avatar_url']));
        $is_active = (int)$data['is_active'];

        $stmt->bindParam(':name', $name);
        $stmt->bindParam(':role', $role);
        $stmt->bindParam(':content', $content);
        $stmt->bindParam(':rating', $rating);
        $stmt->bindParam(':avatar_url', $avatar_url);
        $stmt->bindParam(':is_active', $is_active);
        $stmt->bindParam(':id', $id);

        return $stmt->execute();
    }

    /**
     * Toggle active status
     */
    public function toggleStatus($id) {
        $query = "UPDATE testimonials SET is_active = NOT is_active WHERE id = :id";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':id', $id);
        return $stmt->execute();
    }

    /**
     * Delete testimonial
     */
    public function delete($id) {
        $query = "DELETE FROM testimonials WHERE id = :id";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':id', $id);
        return $stmt->execute();
    }
}
?>
