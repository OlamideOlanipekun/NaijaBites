<?php
// backend/api/public/testimonials.php
require_once '../../config/cors.php';
require_once '../../models/Testimonial.php';
require_once '../../utils/Response.php';

try {
    $testimonial = new Testimonial();
    $data = $testimonial->getActive();
    Response::success("Testimonials retrieved", $data);
} catch (Exception $e) {
    Response::error("Failed to fetch testimonials", 500);
}
?>
