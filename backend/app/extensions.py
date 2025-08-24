from flask_sqlalchemy import SQLAlchemy
from flask_bcrypt import Bcrypt
from flask_jwt_extended import JWTManager
from flask_migrate import Migrate
from flask_marshmallow import Marshmallow
from flask_mail import Mail
from authlib.integrations.flask_client import OAuth

from flask_cors import CORS


db = SQLAlchemy()
bcrypt = Bcrypt()
jwt = JWTManager()
migrate = Migrate()
ma = Marshmallow()
mail = Mail()
oauth = OAuth()
cors = CORS()
