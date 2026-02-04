<?php
// backend/models/Subscriber.php
require_once __DIR__ . '/../config/database.php';

class Subscriber {
    private $conn;

    public function __construct() {
        $database = new Database();
        $this->conn = $database->getConnection();
    }

    /**
     * Subscribe an email
     */
    public function subscribe($email, $ip = null) {
        // Check if already subscribed
        $checkQuery = "SELECT id, is_active FROM subscribers WHERE email = :email";
        $checkStmt = $this->conn->prepare($checkQuery);
        $checkStmt->bindParam(':email', $email);
        $checkStmt->execute();
        
        if ($checkStmt->rowCount() > 0) {
            $existing = $checkStmt->fetch(PDO::FETCH_ASSOC);
            if ($existing['is_active']) {
                return ['success' => false, 'message' => 'Email already subscribed'];
            } else {
                // Reactivate subscription
                $updateQuery = "UPDATE subscribers SET is_active = 1, subscribed_at = CURRENT_TIMESTAMP, ip_address = :ip WHERE id = :id";
                $updateStmt = $this->conn->prepare($updateQuery);
                $updateStmt->bindParam(':id', $existing['id']);
                $updateStmt->bindParam(':ip', $ip);
                $updateStmt->execute();
                return ['success' => true, 'message' => 'Subscription reactivated'];
            }
        }

        // Insert new subscriber
        $query = "INSERT INTO subscribers (email, ip_address) VALUES (:email, :ip)";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':email', $email);
        $stmt->bindParam(':ip', $ip);
        
        if ($stmt->execute()) {
            return ['success' => true, 'message' => 'Subscribed successfully'];
        }
        
        return ['success' => false, 'message' => 'Failed to subscribe'];
    }

    /**
     * Unsubscribe an email
     */
    public function unsubscribe($email) {
        $query = "UPDATE subscribers SET is_active = 0 WHERE email = :email";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':email', $email);
        
        if ($stmt->execute() && $stmt->rowCount() > 0) {
            return ['success' => true, 'message' => 'Unsubscribed successfully'];
        }
        
        return ['success' => false, 'message' => 'Email not found'];
    }

    /**
     * Get all active subscribers (admin function)
     */
    public function getAll() {
        $query = "SELECT id, email, subscribed_at, is_active, ip_address FROM subscribers ORDER BY subscribed_at DESC";
        $stmt = $this->conn->prepare($query);
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    /**
     * Delete a subscriber permanently
     */
    public function delete($id) {
        $query = "DELETE FROM subscribers WHERE id = :id";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':id', $id, PDO::PARAM_INT);
        return $stmt->execute();
    }

    /**
     * Toggle subscriber active status
     */
    public function toggleStatus($id) {
        $query = "UPDATE subscribers SET is_active = NOT is_active WHERE id = :id";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':id', $id, PDO::PARAM_INT);
        return $stmt->execute();
    }

    /**
     * Get subscriber count
     */
    public function getCount() {
        $query = "SELECT COUNT(*) as total, SUM(is_active) as active FROM subscribers";
        $stmt = $this->conn->prepare($query);
        $stmt->execute();
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }

    /**
     * Get all active emails for bulk messaging
     */
    public function getActiveEmails() {
        $query = "SELECT email FROM subscribers WHERE is_active = 1";
        $stmt = $this->conn->prepare($query);
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_COLUMN);
    }
}
?>
