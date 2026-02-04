<?php
// backend/utils/create_admin.php
// Script to create admin user with hashed password

require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../core/Auth.php';

$database = new Database();
$db = $database->getConnection();

if (!$db) {
    die("Database connection failed!");
}

$auth = new Auth($db);

// Create admin user
$username = 'admin';
$password = 'naijabites2024'; // Change this password after first login!

try {
    // Try to create admin
    if ($auth->createAdmin($username, $password, 'admin')) {
        echo "✓ Admin user created successfully!\n";
        echo "Username: $username\n";
        echo "Password: $password\n";
        echo "\nIMPORTANT: Change this password after first login!\n";
    } else {
        echo "✗ Failed to create admin user. User may already exist.\n";
        
        // Try to update password instead
        $passwordHash = $auth->hashPassword($password);
        $query = "UPDATE admin_users SET password_hash = :password_hash WHERE username = :username";
        $stmt = $db->prepare($query);
        $stmt->bindParam(':password_hash', $passwordHash);
        $stmt->bindParam(':username', $username);
        
        if ($stmt->execute()) {
            echo "✓ Admin password updated successfully!\n";
            echo "Username: $username\n";
            echo "Password: $password\n";
        } else {
            echo "✗ Failed to update password.\n";
        }
    }
} catch (Exception $e) {
    echo "Error: " . $e->getMessage() . "\n";
}
?>
