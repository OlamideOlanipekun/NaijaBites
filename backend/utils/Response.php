<?php
// backend/utils/Response.php
class Response {
    
    public static function json($data, $statusCode = 200) {
        http_response_code($statusCode);
        echo json_encode($data);
        exit();
    }

    public static function success($message = "Success", $data = null, $statusCode = 200) {
        $response = [
            'success' => true,
            'message' => $message
        ];
        
        if ($data !== null) {
            $response['data'] = $data;
        }
        
        self::json($response, $statusCode);
    }

    public static function error($message = "An error occurred", $statusCode = 400, $errors = null) {
        $response = [
            'success' => false,
            'message' => $message
        ];
        
        if ($errors !== null) {
            $response['errors'] = $errors;
        }
        
        self::json($response, $statusCode);
    }

    public static function unauthorized($message = "Unauthorized access") {
        self::error($message, 401);
    }

    public static function forbidden($message = "Forbidden") {
        self::error($message, 403);
    }

    public static function notFound($message = "Resource not found") {
        self::error($message, 404);
    }

    public static function validationError($errors, $message = "Validation failed") {
        self::error($message, 422, $errors);
    }

    public static function serverError($message = "Internal server error") {
        self::error($message, 500);
    }
}
?>
