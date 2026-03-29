<?php
/**
 * Plugin Name: Gemini Magic Audit Mailer
 * Description: Adds an API endpoint for Magic Audit bookings and sends notification emails.
 * Version: 1.0.0
 * Author: Gemini Creative
 */

if (!defined('ABSPATH')) {
    exit;
}

const GC_AUDIT_OWNER_EMAIL = 'geminicreativeNF@gmail.com';

add_action('rest_api_init', static function () {
    register_rest_route('gc-audit/v1', '/book', [
        'methods'             => 'POST',
        'callback'            => 'gc_audit_handle_booking',
        'permission_callback' => '__return_true',
    ]);
});

/**
 * @param WP_REST_Request $request
 */
function gc_audit_handle_booking($request): WP_REST_Response
{
    $params = $request->get_json_params();

    $site_url = isset($params['siteUrl']) ? esc_url_raw(trim((string) $params['siteUrl'])) : '';
    $competitor_url = isset($params['competitorUrl']) ? esc_url_raw(trim((string) $params['competitorUrl'])) : '';
    $lead_email = isset($params['leadEmail']) ? sanitize_email((string) $params['leadEmail']) : '';
    $selected_date = isset($params['selectedDate']) ? sanitize_text_field((string) $params['selectedDate']) : '';
    $selected_time = isset($params['selectedTime']) ? sanitize_text_field((string) $params['selectedTime']) : '';

    if (empty($site_url) || empty($lead_email) || empty($selected_date) || empty($selected_time)) {
        return new WP_REST_Response([
            'ok' => false,
            'message' => 'Missing required fields.',
        ], 400);
    }

    if (!is_email($lead_email)) {
        return new WP_REST_Response([
            'ok' => false,
            'message' => 'Invalid email address.',
        ], 400);
    }

    $subject = sprintf('New Magic Audit Booking for %s', wp_parse_url($site_url, PHP_URL_HOST) ?: $site_url);

    $lines = [
        'A new Magic Audit strategy session was booked.',
        '',
        'Website URL: ' . $site_url,
        'Competitor URL: ' . ($competitor_url ?: 'Not provided'),
        'Lead Email: ' . $lead_email,
        'Selected Date: ' . $selected_date,
        'Selected Time: ' . $selected_time,
        'Booked At (UTC): ' . gmdate('Y-m-d H:i:s'),
        'Source Site: ' . home_url('/'),
    ];

    $headers = ['Content-Type: text/plain; charset=UTF-8'];

    $owner_sent = wp_mail(GC_AUDIT_OWNER_EMAIL, $subject, implode("\n", $lines), $headers);

    $confirmation_subject = 'Your Gemini Creative Strategy Session Request';
    $confirmation_message = implode("\n", [
        'Thank you for booking your Magic Audit strategy session with Gemini Creative.',
        '',
        'We received your request for:',
        '- Website: ' . $site_url,
        '- Date: ' . $selected_date,
        '- Time: ' . $selected_time,
        '',
        'We will follow up shortly with your meeting details.',
    ]);

    $lead_sent = wp_mail($lead_email, $confirmation_subject, $confirmation_message, $headers);

    if (!$owner_sent) {
        return new WP_REST_Response([
            'ok' => false,
            'message' => 'Failed to send notification email to Gemini Creative. Check wp_mail/SMTP settings.',
            'leadConfirmationSent' => $lead_sent,
        ], 500);
    }

    return new WP_REST_Response([
        'ok' => true,
        'message' => 'Booking submitted and email sent successfully.',
        'leadConfirmationSent' => $lead_sent,
    ], 200);
}
