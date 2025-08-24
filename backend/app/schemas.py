from .extensions import ma
from .models import User, Shoe, Cart , Order, OrderItem, Payment

# Schema for user registration and login (input validation)
class UserSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = User
        load_instance = True
        # Exclude password when serializing data to send back to user
        exclude = ("password",)

# --- NEW SCHEMAS BELOW ---

# Schema for serializing shoe data (output)
class ShoeSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = Shoe
        load_instance = True
    
    # Custom field to split the sizes string into a list
    sizes = ma.Method("get_sizes_list")

    def get_sizes_list(self, obj):
        return obj.sizes.split(',') if obj.sizes else []

# Schema for serializing cart items (output)
class CartItemSchema(ma.SQLAlchemyAutoSchema):
    # Nest the shoe schema to include shoe details in the cart response
    shoe = ma.Nested(ShoeSchema, only=("id", "name", "price", "image"))
    
    class Meta:
        model = Cart
        load_instance = True
        include_fk = True # Include foreign keys like user_id, shoe_id



class PaymentSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = Payment
        load_instance = True
        
class OrderItemSchema(ma.SQLAlchemyAutoSchema):
    # Nest cart details to show what was in the item
    cart = ma.Nested('CartItemSchema')
    class Meta:
        model = OrderItem
        load_instance = True

class OrderSchema(ma.SQLAlchemyAutoSchema):
    # Nest related items and payment details in the response
    items = ma.Nested(OrderItemSchema, many=True)
    payment = ma.Nested(PaymentSchema)
    class Meta:
        model = Order
        load_instance = True