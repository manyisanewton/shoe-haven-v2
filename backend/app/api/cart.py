from flask import Blueprint, request, jsonify
from app.models import Cart, Shoe
from app.extensions import db
from app.schemas import CartItemSchema
from flask_jwt_extended import jwt_required, get_jwt_identity

cart_bp = Blueprint('cart_bp', __name__)
cart_item_schema = CartItemSchema()
cart_items_schema = CartItemSchema(many=True)

# This decorator ensures a valid JWT is required for all routes in this blueprint
@cart_bp.before_request
@jwt_required()
def require_jwt():
    pass

@cart_bp.route('/', methods=['GET'])
def get_cart():
    user_id = get_jwt_identity() # Get user ID from the JWT token
    cart_items = Cart.query.filter_by(user_id=user_id, paid=False).all()
    return jsonify(cart_items_schema.dump(cart_items))

@cart_bp.route('/', methods=['POST'])
def add_to_cart():
    user_id = get_jwt_identity()
    data = request.get_json()

    shoe_id = data.get('shoe_id')
    size = data.get('size')
    quantity = data.get('quantity', 1)

    if not all([shoe_id, size, quantity]) or not isinstance(quantity, int) or quantity < 1:
        return jsonify({'error': 'Invalid input'}), 400

    shoe = Shoe.query.get(shoe_id)
    if not shoe:
        return jsonify({'error': 'Shoe not found'}), 404
    if shoe.stock < quantity:
        return jsonify({'error': 'Not enough stock available'}), 400

    # Check if the same item (shoe + size) is already in the user's cart
    existing_item = Cart.query.filter_by(user_id=user_id, shoe_id=shoe_id, size=size, paid=False).first()

    if existing_item:
        existing_item.quantity += quantity
    else:
        new_item = Cart(user_id=user_id, shoe_id=shoe_id, size=str(size), quantity=quantity)
        db.session.add(new_item)
    
    db.session.commit()
    return jsonify({'message': 'Item added to cart'}), 201

@cart_bp.route('/<int:cart_item_id>', methods=['PUT'])
def update_cart_item(cart_item_id):
    user_id = get_jwt_identity()
    cart_item = Cart.query.filter_by(id=cart_item_id, user_id=user_id, paid=False).first_or_404()
    
    data = request.get_json()
    quantity = data.get('quantity')

    if not isinstance(quantity, int) or quantity < 1:
        return jsonify({'error': 'Invalid quantity'}), 400
    
    if cart_item.shoe.stock < quantity:
        return jsonify({'error': 'Not enough stock available'}), 400

    cart_item.quantity = quantity
    db.session.commit()
    return jsonify({'message': 'Cart updated successfully'})

@cart_bp.route('/<int:cart_item_id>', methods=['DELETE'])
def remove_cart_item(cart_item_id):
    user_id = get_jwt_identity()
    cart_item = Cart.query.filter_by(id=cart_item_id, user_id=user_id, paid=False).first_or_404()

    db.session.delete(cart_item)
    db.session.commit()
    return jsonify({'message': 'Item removed from cart'})
