<?php
// backend/models/Reservation.php
class Reservation {
    private $conn;
    private $table_name = "reservations";

    public $id;
    public $guest_name;
    public $guest_email;
    public $phone;
    public $date;
    public $time;
    public $guests_count;
    public $message;
    public $status; // pending, confirmed, cancelled

    public function __construct($db) {
        $this->conn = $db;
    }

    public function create() {
        $query = "INSERT INTO " . $this->table_name . " 
                  SET guest_name=:guest_name, guest_email=:guest_email, phone=:phone, date=:date, time=:time, guests_count=:guests_count, message=:message, status='pending'";
        
        $stmt = $this->conn->prepare($query);

        // Sanitize
        $this->guest_name = htmlspecialchars(strip_tags($this->guest_name));
        $this->guest_email = htmlspecialchars(strip_tags($this->guest_email));
        $this->phone = htmlspecialchars(strip_tags($this->phone));
        $this->message = htmlspecialchars(strip_tags($this->message));

        // Bind
        $stmt->bindParam(":guest_name", $this->guest_name);
        $stmt->bindParam(":guest_email", $this->guest_email);
        $stmt->bindParam(":phone", $this->phone);
        $stmt->bindParam(":date", $this->date);
        $stmt->bindParam(":time", $this->time);
        $stmt->bindParam(":guests_count", $this->guests_count);
        $stmt->bindParam(":message", $this->message);

        if ($stmt->execute()) {
            return true;
        }
        return false;
    }

    public function readAll() {
        $query = "SELECT * FROM " . $this->table_name . " ORDER BY date DESC, time DESC";
        $stmt = $this->conn->prepare($query);
        $stmt->execute();
        return $stmt;
    }
}
?>
