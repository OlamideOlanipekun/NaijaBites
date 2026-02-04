<?php
// backend/utils/helpers.php

class Validator {
    
    public static function email($email) {
        return filter_var($email, FILTER_VALIDATE_EMAIL) !== false;
    }

    public static function phone($phone) {
        // Nigerian phone format validation
        $pattern = '/^(\+?234|0)[7-9][0-1]\d{8}$/';
        return preg_match($pattern, $phone);
    }

    public static function required($value) {
        return !empty(trim($value));
    }

    public static function minLength($value, $min) {
        return strlen(trim($value)) >= $min;
    }

    public static function maxLength($value, $max) {
        return strlen(trim($value)) <= $max;
    }

    public static function numeric($value) {
        return is_numeric($value);
    }

    public static function positiveNumber($value) {
        return is_numeric($value) && $value > 0;
    }

    public static function dateInFuture($date) {
        $timestamp = strtotime($date);
        return $timestamp !== false && $timestamp > time();
    }

    public static function sanitize($value) {
        return htmlspecialchars(strip_tags(trim($value)), ENT_QUOTES, 'UTF-8');
    }

    public static function sanitizeArray($array) {
        $sanitized = [];
        foreach ($array as $key => $value) {
            if (is_array($value)) {
                $sanitized[$key] = self::sanitizeArray($value);
            } else {
                $sanitized[$key] = self::sanitize($value);
            }
        }
        return $sanitized;
    }
}

class Logger {
    private static $logDir;

    public static function init() {
        self::$logDir = __DIR__ . '/../logs';
        if (!file_exists(self::$logDir)) {
            mkdir(self::$logDir, 0755, true);
        }
    }

    public static function log($message, $level = 'INFO', $file = 'app.log') {
        self::init();
        $timestamp = date('Y-m-d H:i:s');
        $logMessage = "[$timestamp] [$level] $message" . PHP_EOL;
        file_put_contents(self::$logDir . '/' . $file, $logMessage, FILE_APPEND);
    }

    public static function error($message) {
        self::log($message, 'ERROR', 'error.log');
    }

    public static function info($message) {
        self::log($message, 'INFO', 'app.log');
    }

    public static function debug($message) {
        self::log($message, 'DEBUG', 'debug.log');
    }

    public static function payment($message) {
        self::log($message, 'PAYMENT', 'payment.log');
    }
}

function generateReference($prefix = 'ORD') {
    return $prefix . '-' . strtoupper(uniqid()) . '-' . time();
}

function formatCurrency($amount) {
    return '₦' . number_format($amount, 2);
}

function getRequestBody() {
    $body = file_get_contents("php://input");
    return json_decode($body);
}

function getRequestHeader($header) {
    $headers = getallheaders();
    foreach ($headers as $key => $value) {
        if (strtolower($key) === strtolower($header)) {
            return $value;
        }
    }
    return null;
}
?>
