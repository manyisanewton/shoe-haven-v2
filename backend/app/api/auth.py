from flask import Blueprint, request, jsonify, redirect, url_for, current_app
from app.models import User
from app.extensions import db, bcrypt, oauth
from app.schemas import UserSchema
from flask_jwt_extended import create_access_token
from sqlalchemy.exc import IntegrityError

auth_bp = Blueprint('auth_bp', __name__)
user_schema = UserSchema()

@auth_bp.route('/register', methods=['POST'])
def register():
    """Handles new user registration with email and password."""
    data = request.get_json()
    if not data or not data.get('email') or not data.get('password'):
        return jsonify({'error': 'Email and password are required'}), 400

    email = data.get('email')
    password = data.get('password')

    hashed_password = bcrypt.generate_password_hash(password).decode('utf-8')
    new_user = User(email=email, password=hashed_password)

    try:
        db.session.add(new_user)
        db.session.commit()
    except IntegrityError:
        db.session.rollback()
        return jsonify({'error': 'Email already exists'}), 409
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

    return jsonify(user_schema.dump(new_user)), 201

@auth_bp.route('/login', methods=['POST'])
def login():
    """Handles login with email and password."""
    data = request.get_json()
    if not data or not data.get('email') or not data.get('password'):
        return jsonify({'error': 'Email and password are required'}), 400
        
    email = data.get('email')
    password = data.get('password')

    user = User.query.filter_by(email=email).first()

    # Check if user exists and has a password set (i.e., didn't sign up with Google)
    if user and user.password and bcrypt.check_password_hash(user.password, password):
        access_token = create_access_token(identity=str(user.id))
        return jsonify(access_token=access_token)
    else:
        return jsonify({'error': 'Invalid credentials'}), 401

# --- NEW GOOGLE OAUTH ROUTES ---

@auth_bp.route('/login/google')
def google_login():
    """
    Redirects the user to Google's authentication page.
    The frontend should have a button that links to this endpoint.
    """
    # The URL that Google will redirect back to after authentication
    redirect_uri = url_for('auth_bp.google_authorize', _external=True)
    return oauth.google.authorize_redirect(redirect_uri)

@auth_bp.route('/authorize/google')
def google_authorize():
    """
    Handles the callback from Google.
    This is where we process the user's data and log them in.
    """
    try:
        # Exchange the authorization code for an access token from Google
        token = oauth.google.authorize_access_token()
        # Get user info from the token
        user_info = token.get('userinfo')
        
        if user_info:
            email = user_info['email']
            
            # Check if this user already exists in our database
            user = User.query.filter_by(email=email).first()

            if not user:
                # If user doesn't exist, create a new one.
                # No password is set for OAuth users for security.
                new_user = User(email=email, password=None) 
                db.session.add(new_user)
                db.session.commit()
                user = new_user
            
            # Create our application's own JWT for the user to secure our API
            access_token = create_access_token(identity=str(user.id))
            
            # Redirect the user back to the frontend, passing the token as a query parameter
            frontend_url = current_app.config['FRONTEND_URL']
            return redirect(f"{frontend_url}/login/success?token={access_token}")

    except Exception as e:
        # If anything goes wrong, log the error and redirect to a failure page
        current_app.logger.error(f"Google OAuth failed: {e}")
        frontend_url = current_app.config['FRONTEND_URL']
        return redirect(f"{frontend_url}/login/failure")

    # Fallback redirect in case of an unexpected flow
    return redirect(current_app.config['FRONTEND_URL'])