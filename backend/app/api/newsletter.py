import re
from flask import Blueprint, request, jsonify, current_app
from app.extensions import mail
from flask_mail import Message

newsletter_bp = Blueprint('newsletter_bp', __name__)

def is_valid_email(email):
    """Simple regex for email validation."""
    regex = r'^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$'
    return re.match(regex, email)

@newsletter_bp.route('/subscribe', methods=['POST'])
def subscribe():
    data = request.get_json()
    email = data.get('email')

    if not email or not is_valid_email(email):
        return jsonify({'error': 'A valid email is required'}), 400

    try:
        recipient_email = current_app.config.get('NEWSLETTER_RECIPIENT')
        if not recipient_email:
             # Log an error on the server
            current_app.logger.error("NEWSLETTER_RECIPIENT is not configured.")
            return jsonify({'error': 'Server configuration error'}), 500

        msg = Message(
            subject="New Newsletter Subscription!",
            sender=current_app.config.get('MAIL_DEFAULT_SENDER'),
            recipients=[recipient_email] # Send to the owner
        )
        msg.body = f"The following email has subscribed to the newsletter:\n\n{email}"
        
        mail.send(msg)
        
        return jsonify({'message': 'Subscribed successfully!'}), 200

    except Exception as e:
        # Log the actual error for debugging
        current_app.logger.error(f"Failed to send subscription email: {e}")
        return jsonify({'error': 'Failed to subscribe. Please try again later.'}), 500