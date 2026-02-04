<?php
// backend/api/public/orders/verify_payment.php
require_once '../../../config/cors.php';
require_once '../../../config/database.php';
require_once '../../../config/env.php';
require_once '../../../models/Order.php';
require_once '../../../utils/Response.php';
require_once '../../../utils/helpers.php';

try {
    // Only allow GET
    if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
        Response::error("Method not allowed", 405);
    }

    // Get reference from query parameter
    if (!isset($_GET['reference'])) {
        Response::error("Payment reference is required");
    }
    
    $reference = $_GET['reference'];
    
    // Verify with Paystack
    $secretKey = Env::required('PAYSTACK_SECRET_KEY');
    
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, "https://api.paystack.co/transaction/verify/" . $reference);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
    curl_setopt($ch, CURLOPT_HTTPHEADER, [
        "Authorization: Bearer " . $secretKey
    ]);
    
    $response = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);
    
    if ($httpCode !== 200) {
        Logger::error("Paystack verification failed for reference: $reference");
        Response::error("Payment verification failed");
    }
    
    $result = json_decode($response);
    
    if (!$result || !$result->status) {
        Logger::error("Invalid Paystack response for reference: $reference");
        Response::error("Payment verification failed");
    }
    
    // Check payment status
    $paymentData = $result->data;
    
    if ($paymentData->status === 'success') {
        // Update order status in database
        $database = new Database();
        $db = $database->getConnection();
        
        $order = new Order($db);
        
        if ($order->updateStatus($reference, 'paid')) {
            Logger::payment("Payment verified and order updated: $reference - Amount: " . ($paymentData->amount / 100));
            
            Response::success("Payment verified successfully", [
                'reference' => $reference,
                'amount' => $paymentData->amount / 100, // Paystack returns amount in kobo
                'status' => 'paid',
                'paidAt' => $paymentData->paid_at,
                'channel' => $paymentData->channel
            ]);
        } else {
            Logger::error("Failed to update order status for reference: $reference");
            Response::serverError("Payment verified but failed to update order");
        }
    } else {
        Logger::payment("Payment not successful for reference: $reference - Status: " . $paymentData->status);
        
        Response::error("Payment was not successful", 400, [
            'reference' => $reference,
            'status' => $paymentData->status
        ]);
    }
    
} catch (Exception $e) {
    Logger::error("Verify Payment API Error: " . $e->getMessage());
    Response::serverError("An error occurred while verifying payment");
}
?>
