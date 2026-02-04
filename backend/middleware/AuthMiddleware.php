<?php
// backend/middleware/AuthMiddleware.php
require_once __DIR__ . '/../core/JWTHandler.php';
require_once __DIR__ . '/../utils/Response.php';

class AuthMiddleware {
    /**
     * Authenticate the request
     * Returns the user payload if successful, otherwise terminates request
     */
    public static function authenticate() {
        $token = JWTHandler::extractFromHeader();
        
        if (!$token) {
            Response::unauthorized("No authentication token provided");
        }
        
        $payload = JWTHandler::decode($token);
        
        if (!$payload) {
            Response::unauthorized("Invalid or expired token");
        }
        
        return $payload;
    }
}
?>
