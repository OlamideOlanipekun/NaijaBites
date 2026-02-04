<?php
// backend/test_connection.php
// Quick test script to verify backend setup

require_once __DIR__ . '/config/database.php';
require_once __DIR__ . '/config/env.php';

echo "=== NaijaBites Backend Test ===\n\n";

// Test 1: Environment Variables
echo "1. Testing Environment Variables...\n";
try {
    $dbHost = Env::get('DB_HOST');
    $dbName = Env::get('DB_NAME');
    $jwtSecret = Env::get('JWT_SECRET');
    echo "   ✓ Environment variables loaded successfully\n";
    echo "   - DB Host: $dbHost\n";
    echo "   - DB Name: $dbName\n";
    echo "   - JWT Secret: " . (strlen($jwtSecret) > 10 ? "Set (length: " . strlen($jwtSecret) . ")" : "NOT SET!") . "\n\n";
} catch (Exception $e) {
    echo "   ✗ Error: " . $e->getMessage() . "\n\n";
}

// Test 2: Database Connection
echo "2. Testing Database Connection...\n";
try {
    $database = new Database();
    $db = $database->getConnection();
    
    if ($db) {
        echo "   ✓ Database connected successfully\n\n";
        
        // Test 3: Check Tables
        echo "3. Checking Database Tables...\n";
        $tables = ['categories', 'dishes', 'reservations', 'orders', 'contact_messages', 'admin_users'];
        
        foreach ($tables as $table) {
            $query = "SELECT COUNT(*) as count FROM $table";
            $stmt = $db->prepare($query);
            $stmt->execute();
            $result = $stmt->fetch(PDO::FETCH_ASSOC);
            echo "   ✓ Table '$table' exists (" . $result['count'] . " rows)\n";
        }
        echo "\n";
        
        // Test 4: Sample Menu Query
        echo "4. Testing Menu Query...\n";
        $query = "SELECT d.name, c.name as category, d.price 
                  FROM dishes d 
                  LEFT JOIN categories c ON d.category_id = c.id 
                  LIMIT 3";
        $stmt = $db->prepare($query);
        $stmt->execute();
        
        while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
            echo "   ✓ {$row['name']} ({$row['category']}) - ₦{$row['price']}\n";
        }
        echo "\n";
        
    } else {
        echo "   ✗ Database connection failed\n\n";
    }
} catch (Exception $e) {
    echo "   ✗ Error: " . $e->getMessage() . "\n\n";
}

echo "=== Test Complete ===\n";
echo "\nNext Steps:\n";
echo "1. Run backend/utils/create_admin.php to set up admin user\n";
echo "2. Test API endpoints in browser or Postman\n";
echo "3. Update Paystack keys in .env file\n";
echo "4. Integrate frontend components with API\n";
?>
