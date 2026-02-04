<?php
// backend/models/Order.php
class Order {
    private $conn;
    private $table_name = "orders";

    public $id;
    public $reference;
    public $amount;
    public $status;
    public $customer_email;
    public $items_json;

    public function __construct($db) {
        $this->conn = $db;
    }

    public function create() {
        $query = "INSERT INTO " . $this->table_name . " 
                  SET reference=:reference, amount=:amount, status=:status, customer_email=:customer_email, items_json=:items_json, created_at=NOW()";
        
        $stmt = $this->conn->prepare($query);

        $stmt->bindParam(":reference", $this->reference);
        $stmt->bindParam(":amount", $this->amount);
        $stmt->bindParam(":status", $this->status);
        $stmt->bindParam(":customer_email", $this->customer_email);
        $stmt->bindParam(":items_json", $this->items_json);

        if ($stmt->execute()) {
            return true;
        }
        return false;
    }
    
    public function updateStatus($reference, $status) {
        $query = "UPDATE " . $this->table_name . " SET status = :status WHERE reference = :reference";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(":status", $status);
        $stmt->bindParam(":reference", $reference);
        
        if($stmt->execute()) {
            return true;
        }
        return false;
    }
}
?>
