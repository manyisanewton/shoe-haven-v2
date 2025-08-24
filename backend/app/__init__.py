import os
from flask import Flask
from config import Config
from .extensions import db, bcrypt, jwt, migrate, ma, mail, oauth, cors # <-- Import cors

def create_app(config_class=Config):
    app = Flask(__name__)
    app.config.from_object(config_class)

    # Ensure the instance folder exists
    try:
        os.makedirs(app.instance_path)
    except OSError:
        pass

    # Initialize extensions
    db.init_app(app)
    bcrypt.init_app(app)
    jwt.init_app(app)
    migrate.init_app(app, db)
    ma.init_app(app)
    mail.init_app(app)
    oauth.init_app(app)
    
    # =================================================================
    # --- CORS INITIALIZATION (THE FIX) ---
    # =================================================================
    # Get the frontend URL from the config. Default to '*' for safety,
    # but it's best to have FRONTEND_URL set in your .env
    frontend_url = app.config.get('FRONTEND_URL', '*')
    
    # Initialize CORS to only allow requests from our frontend URL
    # to any route that starts with /api/
    cors.init_app(app, resources={r"/api/*": {"origins": frontend_url}})
    # =================================================================

    oauth.register(
        name='google',
        server_metadata_url='https://accounts.google.com/.well-known/openid-configuration',
        client_id=app.config['GOOGLE_CLIENT_ID'],
        client_secret=app.config['GOOGLE_CLIENT_SECRET'],
        client_kwargs={
            'scope': 'openid email profile'
        }
    )

    # --- REGISTER BLUEPRINTS ---
    from .api.auth import auth_bp
    from .api.products import products_bp
    from .api.cart import cart_bp
    from .api.orders import orders_bp
    from .api.newsletter import newsletter_bp

    app.register_blueprint(auth_bp, url_prefix='/api/auth')
    app.register_blueprint(products_bp, url_prefix='/api')
    app.register_blueprint(cart_bp, url_prefix='/api/cart')
    app.register_blueprint(orders_bp, url_prefix='/api/orders')
    app.register_blueprint(newsletter_bp, url_prefix='/api/newsletter')

    return app