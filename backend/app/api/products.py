from flask import Blueprint, request, jsonify
from app.models import Shoe
from app.schemas import ShoeSchema
from sqlalchemy import or_ # Import 'or_' for searching multiple fields

products_bp = Blueprint('products_bp', __name__)
shoe_schema = ShoeSchema()
shoes_schema = ShoeSchema(many=True)

@products_bp.route('/shoes', methods=['GET'])
def get_shoes():
    page = request.args.get('page', 1, type=int)
    per_page = request.args.get('per_page', 8, type=int)
    
    paginated_shoes = Shoe.query.paginate(page=page, per_page=per_page, error_out=False)
    
    return jsonify({
        'shoes': shoes_schema.dump(paginated_shoes.items),
        'total': paginated_shoes.total,
        'pages': paginated_shoes.pages,
        'current_page': page
    })

# --- NEW ADVANCED FILTERING & SEARCH ROUTE ---
@products_bp.route('/shoes/search', methods=['GET'])
def search_and_filter_shoes():
    # Get query parameters
    query_str = request.args.get('q', '', type=str)
    brand = request.args.get('brand', '', type=str)
    min_price = request.args.get('min_price', type=float)
    max_price = request.args.get('max_price', type=float)
    size = request.args.get('size', '', type=str)
    page = request.args.get('page', 1, type=int)
    per_page = request.args.get('per_page', 8, type=int)

    # Start with a base query
    query = Shoe.query

    # Apply search term filter (for name or description)
    if query_str:
        query = query.filter(or_(
            Shoe.name.ilike(f'%{query_str}%'),
            Shoe.description.ilike(f'%{query_str}%')
        ))

    # Apply filters
    if brand:
        query = query.filter(Shoe.brand == brand)
    if min_price is not None:
        query = query.filter(Shoe.price >= min_price)
    if max_price is not None:
        query = query.filter(Shoe.price <= max_price)
    if size:
        # Using LIKE to find the size in the comma-separated string
        query = query.filter(Shoe.sizes.like(f'%{size}%'))

    paginated_results = query.paginate(page=page, per_page=per_page, error_out=False)

    return jsonify({
        'shoes': shoes_schema.dump(paginated_results.items),
        'total': paginated_results.total,
        'pages': paginated_results.pages,
        'current_page': page
    })


@products_bp.route('/shoes/<int:shoe_id>', methods=['GET'])
def get_shoe(shoe_id):
    shoe = Shoe.query.get_or_404(shoe_id)
    return jsonify(shoe_schema.dump(shoe))