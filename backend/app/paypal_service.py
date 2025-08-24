import requests
from flask import current_app
import certifi # Import the certifi library

class PayPalService:
    def __init__(self):
        self.client_id = current_app.config['PAYPAL_CLIENT_ID']
        self.client_secret = current_app.config['PAYPAL_CLIENT_SECRET']
        self.base_url = current_app.config['PAYPAL_API_BASE']

    def get_access_token(self):
        url = f"{self.base_url}/v1/oauth2/token"
        headers = {'Accept': 'application/json', 'Accept-Language': 'en_US'}
        data = {'grant_type': 'client_credentials'}
        auth = (self.client_id, self.client_secret)
        
        # --- SECURE FIX ---
        # Explicitly use certifi's certificate bundle for SSL verification.
        response = requests.post(url, headers=headers, data=data, auth=auth, verify=certifi.where())
        
        response.raise_for_status()
        return response.json()['access_token']

    def create_order(self, total_amount):
        access_token = self.get_access_token()
        url = f"{self.base_url}/v2/checkout/orders"
        headers = {
            'Content-Type': 'application/json',
            'Authorization': f'Bearer {access_token}'
        }
        payload = {
            "intent": "CAPTURE",
            "purchase_units": [{
                "amount": {
                    "currency_code": "USD", # PayPal requires major currencies
                    "value": str(round(total_amount, 2)) # Ensure value is a string with 2 decimal places
                }
            }]
        }

        # --- SECURE FIX ---
        response = requests.post(url, headers=headers, json=payload, verify=certifi.where())

        response.raise_for_status()
        return response.json()

    def capture_payment(self, paypal_order_id):
        access_token = self.get_access_token()
        url = f"{self.base_url}/v2/checkout/orders/{paypal_order_id}/capture"
        headers = {
            'Content-Type': 'application/json',
            'Authorization': f'Bearer {access_token}'
        }

        # --- SECURE FIX ---
        response = requests.post(url, headers=headers, verify=certifi.where())
        
        response.raise_for_status()
        return response.json()