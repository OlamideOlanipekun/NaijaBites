<?php
// backend/core/JWTHandler.php
require_once __DIR__ . '/../config/env.php';

class JWTHandler {
    private static $secret;
    private static $expiry;

    public static function init() {
        self::$secret = Env::required('JWT_SECRET');
        self::$expiry = Env::get('JWT_EXPIRY', 3600);
    }

    /**
     * Generate JWT Token
     */
    public static function generate($payload) {
        self::init();
        
        // Header
        $header = json_encode(['typ' => 'JWT', 'alg' => 'HS256']);
        
        // Add expiry to payload
        $payload['iat'] = time();
        $payload['exp'] = time() + self::$expiry;
        
        $payload = json_encode($payload);
        
        // Encode Header & Payload
        $base64UrlHeader = self::base64UrlEncode($header);
        $base64UrlPayload = self::base64UrlEncode($payload);
        
        // Create Signature
        $signature = hash_hmac('sha256', $base64UrlHeader . "." . $base64UrlPayload, self::$secret, true);
        $base64UrlSignature = self::base64UrlEncode($signature);
        
        // Create JWT
        $jwt = $base64UrlHeader . "." . $base64UrlPayload . "." . $base64UrlSignature;
        
        return $jwt;
    }

    /**
     * Validate and decode JWT Token
     */
    public static function decode($jwt) {
        self::init();
        
        if (!$jwt) {
            return false;
        }

        // Split the JWT
        $tokenParts = explode('.', $jwt);
        if (count($tokenParts) !== 3) {
            return false;
        }

        $header = base64_decode($tokenParts[0]);
        $payload = base64_decode($tokenParts[1]);
        $signatureProvided = $tokenParts[2];

        // Verify signature
        $base64UrlHeader = self::base64UrlEncode($header);
        $base64UrlPayload = self::base64UrlEncode($payload);
        $signature = hash_hmac('sha256', $base64UrlHeader . "." . $base64UrlPayload, self::$secret, true);
        $base64UrlSignature = self::base64UrlEncode($signature);

        if ($base64UrlSignature !== $signatureProvided) {
            return false;
        }

        // Decode payload
        $payloadData = json_decode($payload, true);

        // Check expiry
        if (isset($payloadData['exp']) && $payloadData['exp'] < time()) {
            return false; // Token expired
        }

        return $payloadData;
    }

    /**
     * Extract token from Authorization header
     */
    public static function extractFromHeader() {
        $headers = getallheaders();
        
        if (!isset($headers['Authorization'])) {
            return null;
        }

        $authHeader = $headers['Authorization'];
        
        // Check if Bearer token
        if (preg_match('/Bearer\s+(.*)$/i', $authHeader, $matches)) {
            return $matches[1];
        }

        return null;
    }

    /**
     * Base64 URL Encode
     */
    private static function base64UrlEncode($text) {
        return str_replace(
            ['+', '/', '='],
            ['-', '_', ''],
            base64_encode($text)
        );
    }
}
?>
