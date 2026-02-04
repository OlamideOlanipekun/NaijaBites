<?php
// backend/api/admin/reservations.php
require_once '../../config/cors.php';
require_once '../../middleware/AuthMiddleware.php';
require_once '../../utils/Response.php';
require_once '../../config/database.php';
require_once '../../utils/Mailer.php';

// Authenticate request
$user = AuthMiddleware::authenticate();

$database = new Database();
$db = $database->getConnection();

$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {
    case 'GET':
        try {
            // Fetch all reservations ordered by newest first
            $query = "SELECT * FROM reservations ORDER BY created_at DESC";
            $stmt = $db->prepare($query);
            $stmt->execute();
            $reservations = $stmt->fetchAll(PDO::FETCH_ASSOC);
            
            Response::success("Reservations retrieved", $reservations);
        } catch (PDOException $e) {
            Response::error("Database error: " . $e->getMessage());
        }
        break;

    case 'PUT':
        $data = json_decode(file_get_contents("php://input"));
        
        if (!isset($data->id) || !isset($data->status)) {
            Response::error("Missing reservation ID or status");
        }
        
        $validStatuses = ['pending', 'confirmed', 'cancelled'];
        if (!in_array($data->status, $validStatuses)) {
            Response::error("Invalid status");
        }

        try {
            // Fetch reservation details first to get email
            $fetchQuery = "SELECT * FROM reservations WHERE id = :id";
            $fetchStmt = $db->prepare($fetchQuery);
            $fetchStmt->bindParam(':id', $data->id);
            $fetchStmt->execute();
            $reservation = $fetchStmt->fetch(PDO::FETCH_ASSOC);

            if (!$reservation) {
                Response::error("Reservation not found");
            }

            // Update status
            $query = "UPDATE reservations SET status = :status WHERE id = :id";
            $stmt = $db->prepare($query);
            $stmt->bindParam(':status', $data->status);
            $stmt->bindParam(':id', $data->id);

            if ($stmt->execute()) {
                // Send Email Notification if status changed
                if ($data->status !== $reservation['status'] && !empty($reservation['guest_email'])) {
                    $to = $reservation['guest_email'];
                    $dateStr = date('l, F j, Y', strtotime($reservation['date']));
                    $timeStr = date('g:i A', strtotime($reservation['time']));
                    $name = htmlspecialchars($reservation['guest_name']);
                    
                    if ($data->status === 'confirmed') {
                        $subject = "Reservation Confirmed! ✅ - NaijaBites";
                        $message = "
                            <p>Dear $name,</p>
                            <p>We are delighted to confirm your reservation at Naija Bites!</p>
                            <div style='background: #f0fdf4; padding: 15px; border-radius: 8px; border: 1px solid #bbf7d0; margin: 20px 0;'>
                                <p style='margin: 5px 0;'><strong>📅 Date:</strong> $dateStr</p>
                                <p style='margin: 5px 0;'><strong>⏰ Time:</strong> $timeStr</p>
                                <p style='margin: 5px 0;'><strong>👥 Guests:</strong> {$reservation['guests_count']}</p>
                            </div>
                            <p>We can't wait to serve you our authentic flavors.</p>
                            <p>See you soon!</p>
                        ";
                        Mailer::send($to, $subject, $message);
                    } elseif ($data->status === 'cancelled') {
                         $subject = "Reservation Update - NaijaBites";
                         $message = "
                            <p>Dear $name,</p>
                            <p>This email is to inform you that your reservation for <strong>$dateStr</strong> at <strong>$timeStr</strong> has been cancelled.</p>
                            <p>If you did not request this cancellation or would like to reschedule, please visit our website or contact us directly.</p>
                            <p><a href='http://localhost:3000/reservations' class='button'>Book New Table</a></p>
                        ";
                        Mailer::send($to, $subject, $message);
                    }
                }

                Response::success("Reservation updated and notification sent (if configured)");
            } else {
                Response::error("Failed to update reservation");
            }
        } catch (PDOException $e) {
            Response::error("Database error: " . $e->getMessage());
        }
        break;

    default:
        Response::error("Method not allowed", 405);
        break;
}
?>
