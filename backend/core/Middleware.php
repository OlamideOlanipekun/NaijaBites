<?php
// backend/core/Middleware.php
require_once __DIR__ . '/JWTHandler.php';
require_once __DIR__ . '/../utils/Response.php';

class Middleware {
    
    /**
     * Authenticate user via JWT token
     * Returns user data if valid, sends error response if invalid
     */
    public static function authenticate() {
        // Extract token from Authorization header
        $token = JWTHandler::extractFromHeader();
        
        if (!$token) {
            Response::unauthorized("No authentication token provided");
        }
        
        // Validate and decode token
        $userData = JWTHandler::decode($token);
        
        if ($userData === false) {
            Response::unauthorized("Invalid or expired token");
        }
        
        return $userData;
    }

    /**
     * Check if user has required role
     */
    public static function requireRole($userData, $requiredRole) {
        if (!isset($userData['role']) || $userData['role'] !== $requiredRole) {
            Response::forbidden("Insufficient permissions");
        }
    }

    /**
     * Check if user is admin
     */
    public static function requireAdmin($userData) {
        if (!isset($userData['role']) || $userData['role'] !== 'admin') {
            Response::forbidden("Admin access required");
        }
    }
}
?>
