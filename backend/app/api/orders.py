import os
import re
from flask import Blueprint, request, jsonify, Response
from app.models import Cart, Shoe, Order, OrderItem, Payment
from app.extensions import db
from app.schemas import OrderSchema
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.mpesa_handler import MpesaHandler
from fpdf import FPDF
from datetime import datetime

orders_bp = Blueprint('orders_bp', __name__)
order_schema = OrderSchema()
orders_schema = OrderSchema(many=True)
mpesa = MpesaHandler()

def normalize_phone_number(phone):
    """Normalizes Kenyan phone numbers to 2547... or 2541... format."""
    phone = re.sub(r'\s+', '', str(phone))  # Remove whitespace
    if phone.startswith('+254'):
        return phone[1:]
    if phone.startswith('07'):
        return '254' + phone[1:]
    if phone.startswith('01'):
        return '254' + phone[1:]
    if phone.startswith('254') and len(phone) == 12:
        return phone
    return None  # Return None if format is unrecognized

@orders_bp.route('/checkout', methods=['POST'])
@jwt_required()
def checkout():
    user_id = get_jwt_identity()
    data = request.get_json()
    raw_phone = data.get('phone_number')
    
    phone_number = normalize_phone_number(raw_phone)

    if not phone_number:
        return jsonify({'error': 'Invalid phone number. Use 07xx, 01xx, or 254xx format.'}), 400

    # Retrieve all unpaid cart items for the user
    cart_items = Cart.query.filter_by(user_id=user_id, paid=False).all()
    if not cart_items:
        return jsonify({'error': 'Your cart is empty'}), 400

    total_amount = 0
    # --- Check stock before proceeding ---
    for item in cart_items:
        if item.shoe.stock < item.quantity:
            return jsonify({'error': f"Not enough stock for {item.shoe.name}. Available: {item.shoe.stock}"}), 400
        total_amount += item.shoe.price * item.quantity

    new_order = Order(user_id=user_id, total_amount=total_amount, status='pending')
    
    # --- Use a transaction to ensure data integrity ---
    try:
        db.session.add(new_order)
        db.session.flush()  # Assigns an ID to new_order without committing

        for item in cart_items:
            # Create order item
            order_item = OrderItem(order_id=new_order.id, cart_id=item.id)
            db.session.add(order_item)
            
            # Reduce stock
            shoe = Shoe.query.get(item.shoe_id)
            shoe.stock -= item.quantity
            
            # Mark cart item as paid
            item.paid = True
        
        # Initiate M-Pesa STK Push
        callback_url = os.getenv('CALLBACK_URL')
        response = mpesa.initiate_stk_push(phone_number, int(total_amount), new_order.id, callback_url)

        if response.get('ResponseCode') == '0':
            new_order.checkout_request_id = response['CheckoutRequestID']
            db.session.commit() # Commit all changes only if STK push is successful
            return jsonify({
                'message': 'Checkout process initiated. Please complete the payment on your phone.',
                'order_id': new_order.id,
                'CheckoutRequestID': response['CheckoutRequestID']
            })
        else:
            db.session.rollback() # Rollback if STK push fails
            return jsonify({'error': 'Failed to initiate M-Pesa payment', 'details': response.get('ResponseDescription', 'Unknown error')}), 500

    except Exception as e:
        db.session.rollback()
        return jsonify({'error': 'An error occurred during checkout', 'details': str(e)}), 500

@orders_bp.route('/callback', methods=['POST'])
def mpesa_callback():
    data = request.get_json()
    # Add logging in a real app: current_app.logger.info(f"Callback received: {data}")
    
    try:
        stk_callback = data['Body']['stkCallback']
        result_code = stk_callback['ResultCode']
        checkout_request_id = stk_callback['CheckoutRequestID']
        order = Order.query.filter_by(checkout_request_id=checkout_request_id).first()

        if not order:
            return jsonify({'error': 'Order not found'}), 404

        if result_code == 0:
            # Payment was successful
            metadata = stk_callback['CallbackMetadata']['Item']
            mpesa_code = next((item['Value'] for item in metadata if item['Name'] == 'MpesaReceiptNumber'), None)
            amount = float(next((item['Value'] for item in metadata if item['Name'] == 'Amount'), 0))
            phone = str(next((item['Value'] for item in metadata if item['Name'] == 'PhoneNumber'), ''))
            tx_date_str = str(next((item['Value'] for item in metadata if item['Name'] == 'TransactionDate')), '')
            tx_date = datetime.strptime(tx_date_str, '%Y%m%d%H%M%S')

            new_payment = Payment(
                order_id=order.id,
                mpesa_code=str(mpesa_code),
                amount=amount,
                phone_number=phone,
                transaction_date=tx_date
            )
            order.status = 'completed'
            db.session.add(new_payment)
        else:
            # Payment failed or was cancelled, revert stock
            order.status = 'cancelled'
            for item in order.items:
                shoe = item.cart.shoe
                shoe.stock += item.cart.quantity

        db.session.commit()
        return jsonify({'message': 'Callback received successfully'}), 200

    except Exception as e:
        # Add logging: current_app.logger.error(f"Callback processing failed: {e}")
        return jsonify({'error': 'Callback processing failed', 'details': str(e)}), 500

@orders_bp.route('/', methods=['GET'])
@jwt_required()
def get_orders():
    user_id = get_jwt_identity()
    orders = Order.query.filter_by(user_id=user_id).order_by(Order.created_at.desc()).all()
    return jsonify(orders_schema.dump(orders))

@orders_bp.route('/<int:order_id>', methods=['GET'])
@jwt_required()
def get_order_status(order_id):
    user_id = get_jwt_identity()
    order = Order.query.filter_by(id=order_id, user_id=user_id).first_or_404()
    return jsonify(order_schema.dump(order))


# --- PDF RECEIPT GENERATION ---

class PDF(FPDF):
    def header(self):
        self.set_font('helvetica', 'B', 16)
        self.cell(0, 10, 'Shoe Haven Receipt', 0, 1, 'C')
        self.ln(10)

    def footer(self):
        self.set_y(-15)
        self.set_font('helvetica', 'I', 8)
        self.cell(0, 10, f'Page {self.page_no()}', 0, 0, 'C')

def generate_receipt_pdf(order):
    pdf = PDF()
    pdf.add_page()
    pdf.set_font('helvetica', '', 12)
    
    # Order Details
    pdf.cell(0, 8, f"Order ID: {order.id}", 0, 1)
    pdf.cell(0, 8, f"Order Date: {order.created_at.strftime('%Y-%m-%d %H:%M:%S')}", 0, 1)
    if order.payment:
        pdf.cell(0, 8, f"Paid Via: M-Pesa ({order.payment.phone_number})", 0, 1)
        pdf.cell(0, 8, f"M-Pesa Code: {order.payment.mpesa_code}", 0, 1)
    pdf.ln(10)

    # Table Header
    pdf.set_font('helvetica', 'B', 12)
    pdf.cell(100, 10, 'Item', 1, 0, 'C')
    pdf.cell(20, 10, 'Size', 1, 0, 'C')
    pdf.cell(20, 10, 'Qty', 1, 0, 'C')
    pdf.cell(30, 10, 'Price', 1, 1, 'C')
    pdf.set_font('helvetica', '', 12)

    # Table Rows
    for item in order.items:
        pdf.cell(100, 10, item.cart.shoe.name, 1)
        pdf.cell(20, 10, str(item.cart.size), 1, 0, 'C')
        pdf.cell(20, 10, str(item.cart.quantity), 1, 0, 'C')
        pdf.cell(30, 10, f"KES {item.cart.shoe.price * item.cart.quantity}", 1, 1, 'R')
    
    # Total
    pdf.set_font('helvetica', 'B', 12)
    pdf.cell(140, 10, 'Total', 1, 0, 'R')
    pdf.cell(30, 10, f"KES {order.total_amount}", 1, 1, 'R')
    
    return pdf.output(dest='S').encode('latin-1')

@orders_bp.route('/<int:order_id>/receipt', methods=['GET'])
@jwt_required()
def download_receipt(order_id):
    user_id = get_jwt_identity()
    order = Order.query.filter_by(id=order_id, user_id=user_id).first()

    if not order:
        return jsonify({'error': 'Order not found'}), 404
    if order.status != 'completed' or not order.payment:
        return jsonify({'error': 'Receipt is only available for completed payments'}), 400

    pdf_data = generate_receipt_pdf(order)

    return Response(
        pdf_data,
        mimetype='application/pdf',
        headers={'Content-Disposition': f'attachment;filename=receipt_order_{order.id}.pdf'}
    )

# ... (at the top with other imports)
from app.paypal_service import PayPalService

# ... (inside the file, after the checkout function)

# --- NEW PAYPAL ROUTES ---

@orders_bp.route('/paypal/create', methods=['POST'])
@jwt_required()
def create_paypal_order():
    user_id = get_jwt_identity()
    cart_items = Cart.query.filter_by(user_id=user_id, paid=False).all()
    if not cart_items:
        return jsonify({'error': 'Your cart is empty'}), 400

    # For simplicity, we'll treat KES as USD.
    # In a real app, you'd convert KES to USD here using an exchange rate API.
    total_amount = sum(item.shoe.price * item.quantity for item in cart_items)

    try:
        paypal = PayPalService()
        paypal_order = paypal.create_order(round(total_amount, 2))
        return jsonify({'orderID': paypal_order['id']})
    except Exception as e:
        return jsonify({'error': 'Failed to create PayPal order', 'details': str(e)}), 500


@orders_bp.route('/paypal/<paypal_order_id>/capture', methods=['POST'])
@jwt_required()
def capture_paypal_payment(paypal_order_id):
    user_id = get_jwt_identity()
    
    try:
        paypal = PayPalService()
        capture_data = paypal.capture_payment(paypal_order_id)

        # Security Check: Ensure payment is 'COMPLETED'
        if capture_data.get('status') != 'COMPLETED':
            return jsonify({'error': 'Payment not completed by PayPal'}), 400

        # If payment is successful, finalize the order in our database
        cart_items = Cart.query.filter_by(user_id=user_id, paid=False).all()
        total_amount = sum(item.shoe.price * item.quantity for item in cart_items)

        new_order = Order(
            user_id=user_id, 
            total_amount=total_amount, 
            status='completed', 
            paypal_order_id=paypal_order_id
        )
        
        db.session.add(new_order)
        db.session.flush()

        for item in cart_items:
            order_item = OrderItem(order_id=new_order.id, cart_id=item.id)
            db.session.add(order_item)
            item.shoe.stock -= item.quantity
            item.paid = True
        
        # We don't need a separate Payment model entry for this, as the order itself is the record.
        
        db.session.commit()
        return jsonify({
            'message': 'Payment successful!', 
            'order_id': new_order.id
        })

    except Exception as e:
        db.session.rollback()
        return jsonify({'error': 'Failed to capture payment', 'details': str(e)}), 500