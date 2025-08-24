from .extensions import db
from datetime import datetime

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(128), nullable=True) 
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

class Shoe(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    brand = db.Column(db.String(50), nullable=False)
    description = db.Column(db.Text, nullable=False)
    price = db.Column(db.Float, nullable=False)
    details = db.Column(db.Text, nullable=False)
    sizes = db.Column(db.String(100), nullable=False)
    image = db.Column(db.String(200), nullable=False)
    rating = db.Column(db.Float, nullable=False)
    stock = db.Column(db.Integer, nullable=False)

class Cart(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    shoe_id = db.Column(db.Integer, db.ForeignKey('shoe.id'), nullable=False)
    size = db.Column(db.String(10), nullable=False)
    quantity = db.Column(db.Integer, nullable=False)
    paid = db.Column(db.Boolean, default=False)
    shoe = db.relationship('Shoe', backref=db.backref('carts', lazy=True))
    user = db.relationship('User', backref=db.backref('cart_items', lazy=True))

class Order(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    total_amount = db.Column(db.Float, nullable=False)
    status = db.Column(db.String(20), nullable=False, default='pending')
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    # --- M-PESA RELATED ---
    checkout_request_id = db.Column(db.String(100), nullable=True)

    # --- PAYPAL FIELD ---
    paypal_order_id = db.Column(db.String(100), nullable=True)

    user = db.relationship('User', backref=db.backref('orders', lazy=True))

class OrderItem(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    order_id = db.Column(db.Integer, db.ForeignKey('order.id'), nullable=False)
    cart_id = db.Column(db.Integer, db.ForeignKey('cart.id'), nullable=False)
    order = db.relationship('Order', backref=db.backref('items', lazy=True))
    cart = db.relationship('Cart', backref=db.backref('order_items', lazy=True))

class Payment(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    order_id = db.Column(db.Integer, db.ForeignKey('order.id'), nullable=False)
    mpesa_code = db.Column(db.String(50), nullable=False)
    amount = db.Column(db.Float, nullable=False)
    phone_number = db.Column(db.String(20), nullable=False)
    transaction_date = db.Column(db.DateTime, nullable=False)
    order = db.relationship('Order', backref=db.backref('payment', uselist=False))