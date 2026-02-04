<?php
// backend/utils/Mailer.php

class Mailer {
    public static function send($to, $subject, $message) {
        // Headers for HTML email
        $headers = "MIME-Version: 1.0" . "\r\n";
        $headers .= "Content-type:text/html;charset=UTF-8" . "\r\n";
        
        // Format: Name <email>
        $fromEmail = 'noreply@naijabites.com'; // In production, use a real domain email
        $headers .= "From: NaijaBites <$fromEmail>" . "\r\n";
        $headers .= "Reply-To: contact@naijabites.com" . "\r\n";
        
        // Wrap message in a nice template
        $htmlContent = self::getTemplate($subject, $message);
        
        // Send
        // Note: For local XAMPP, mail() implies sendmail/Mercury/Mailhog is configured.
        // If not configured, this might return false or just do nothing (fail silently or warn).
        // Using @mail to suppress warnings in API response if config is missing.
        return @mail($to, $subject, $htmlContent, $headers);
    }

    private static function getTemplate($title, $body) {
        $year = date('Y');
        return "
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset='UTF-8'>
            <style>
                body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background-color: #f4f4f4; }
                .container { max-width: 600px; margin: 20px auto; background: white; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
                .header { background-color: #064e3b; color: white; padding: 30px 20px; text-align: center; }
                .header h1 { margin: 0; font-size: 24px; text-transform: uppercase; letter-spacing: 2px; }
                .header span { color: #eab308; font-style: italic; }
                .content { padding: 30px; }
                .footer { background-color: #f9fafb; text-align: center; padding: 20px; font-size: 12px; color: #6b7280; border-top: 1px solid #e5e7eb; }
                .button { display: inline-block; padding: 10px 20px; background-color: #eab308; color: #064e3b; text-decoration: none; border-radius: 5px; font-weight: bold; margin-top: 15px; }
            </style>
        </head>
        <body>
            <div class='container'>
                <div class='header'>
                    <h1>Naija<span>Bites</span></h1>
                </div>
                <div class='content'>
                    <h2 style='color: #064e3b; margin-top: 0;'>$title</h2>
                    $body
                </div>
                <div class='footer'>
                    &copy; $year Naija Bites & Grills. All rights reserved.<br>
                    15 Flavors Avenue, VI, Lagos
                </div>
            </div>
        </body>
        </html>
        ";
    }
}
?>
