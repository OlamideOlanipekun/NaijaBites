<?php
// backend/core/Auth.php
require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/JWTHandler.php';

class Auth {
    private $conn;
    private $table_name = "admin_users";

    public function __construct($db) {
        $this->conn = $db;
    }

    public function login($username, $password) {
        $query = "SELECT id, username, password_hash, role FROM " . $this->table_name . " WHERE username = :username LIMIT 0,1";
        $stmt = $this->conn->prepare($query);
        
        $username = htmlspecialchars(strip_tags($username));
        $stmt->bindParam(':username', $username);
        $stmt->execute();

        if ($stmt->rowCount() > 0) {
            $row = $stmt->fetch(PDO::FETCH_ASSOC);
            if (password_verify($password, $row['password_hash'])) {
                // Generate JWT token
                $payload = [
                    'user_id' => $row['id'],
                    'username' => $row['username'],
                    'role' => $row['role']
                ];
                
                $token = JWTHandler::generate($payload);
                
                return [
                    'status' => true,
                    'token' => $token,
                    'user' => [
                        'id' => $row['id'],
                        'username' => $row['username'],
                        'role' => $row['role']
                    ]
                ];
            }
        }
        return ['status' => false, 'message' => 'Invalid credentials'];
    }

    public function validateToken($token) {
        $decoded = JWTHandler::decode($token);
        
        if ($decoded === false) {
            return false;
        }
        
        return $decoded;
    }

    public function hashPassword($password) {
        return password_hash($password, PASSWORD_DEFAULT);
    }

    public function createAdmin($username, $password, $role = 'admin') {
        $query = "INSERT INTO " . $this->table_name . " (username, password_hash, role) VALUES (:username, :password_hash, :role)";
        $stmt = $this->conn->prepare($query);
        
        $username = htmlspecialchars(strip_tags($username));
        $password_hash = $this->hashPassword($password);
        
        $stmt->bindParam(':username', $username);
        $stmt->bindParam(':password_hash', $password_hash);
        $stmt->bindParam(':role', $role);
        
        if ($stmt->execute()) {
            return true;
        }
        return false;
    }
}
?>
