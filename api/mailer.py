import os
import requests


class MailerError(Exception):
    pass


def send_password_reset_email(to_email: str, reset_link: str) -> None:
    provider = os.getenv('MAIL_PROVIDER', 'resend').lower()
    if provider != 'resend':
        raise MailerError('Unsupported mail provider configured')

    api_key = os.getenv('RESEND_API_KEY')
    from_email = os.getenv('MAIL_FROM', 'noreply@studentpredictorpro.com')
    if not api_key:
        raise MailerError('RESEND_API_KEY missing in environment')

    response = requests.post(
        'https://api.resend.com/emails',
        headers={
            'Authorization': f'Bearer {api_key}',
            'Content-Type': 'application/json',
        },
        json={
            'from': from_email,
            'to': [to_email],
            'subject': 'Reset your Student Performance Predictor Pro password',
            'html': f'<p>Click to reset your password:</p><p><a href="{reset_link}">{reset_link}</a></p>',
        },
        timeout=10,
    )

    if response.status_code >= 300:
        raise MailerError('Failed to send email via Resend')
