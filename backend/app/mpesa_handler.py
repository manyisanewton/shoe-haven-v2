import requests
import base64
from datetime import datetime
import os
from dotenv import load_dotenv
import logging
import logging.handlers
import re

# Set up logging
log_dir = 'logs'
if not os.path.exists(log_dir):
    os.makedirs(log_dir)
logger = logging.getLogger(__name__)
logger.setLevel(logging.DEBUG)
file_handler = logging.handlers.RotatingFileHandler('logs/mpesa.log', maxBytes=1000000, backupCount=5)
file_handler.setFormatter(logging.Formatter('%(asctime)s - %(levelname)s - %(message)s'))
logger.addHandler(file_handler)
console_handler = logging.StreamHandler()
console_handler.setFormatter(logging.Formatter('%(asctime)s - %(levelname)s - %(message)s'))
logger.addHandler(console_handler)

load_dotenv()

class MpesaHandler:
    def __init__(self):
        self.consumer_key = os.getenv('CONSUMER_KEY')
        self.consumer_secret = os.getenv('CONSUMER_SECRET')
        self.pass_key = os.getenv('PASS_KEY')
        self.short_code = os.getenv('BUSINESS_SHORT_CODE')
        self.callback_url = os.getenv('CALLBACK_URL')
        self.initiator_name = os.getenv('INITIATOR_NAME', 'testapi')
        self.security_credential = os.getenv('SECURITY_CREDENTIAL', 'your_security_credential')
        self.api_url = 'https://sandbox.safaricom.co.ke' if os.getenv('API_ENVIRONMENT') == 'sandbox' else 'https://api.safaricom.co.ke'
        
        # Validate environment variables
        missing_vars = []
        required_vars = {
            'CONSUMER_KEY': self.consumer_key,
            'CONSUMER_SECRET': self.consumer_secret,
            'PASS_KEY': self.pass_key,
            'BUSINESS_SHORT_CODE': self.short_code,
            'CALLBACK_URL': self.callback_url,
            'API_ENVIRONMENT': os.getenv('API_ENVIRONMENT')
        }
        for var_name, var_value in required_vars.items():
            if not var_value:
                missing_vars.append(var_name)
        if missing_vars:
            logger.error(f"Missing required environment variables: {', '.join(missing_vars)}")
            raise ValueError(f"Missing required environment variables: {', '.join(missing_vars)}")
        
        # Validate callback URL format
        if not re.match(r'^https://', self.callback_url):
            logger.error(f"Invalid CALLBACK_URL: {self.callback_url}. Must be HTTPS.")
            raise ValueError("CALLBACK_URL must be a valid HTTPS URL")

    def get_access_token(self):
        url = f'{self.api_url}/oauth/v1/generate?grant_type=client_credentials'
        credentials = base64.b64encode(f"{self.consumer_key}:{self.consumer_secret}".encode()).decode()
        headers = {'Authorization': f'Basic {credentials}'}
        try:
            response = requests.get(url, headers=headers, timeout=10)
            response.raise_for_status()
            return response.json()['access_token']
        except requests.RequestException as e:
            logger.error(f"Failed to get access token: {e}")
            raise

    def generate_password(self):
        timestamp = datetime.now().strftime('%Y%m%d%H%M%S')
        data = f'{self.short_code}{self.pass_key}{timestamp}'
        return base64.b64encode(data.encode()).decode('utf-8'), timestamp

    def initiate_stk_push(self, phone_number, amount, order_id, callback_url):
        try:
            access_token = self.get_access_token()
            password, timestamp = self.generate_password()
            headers = {'Authorization': f'Bearer {access_token}', 'Content-Type': 'application/json'}
            payload = {
                'BusinessShortCode': self.short_code,
                'Password': password,
                'Timestamp': timestamp,
                'TransactionType': 'CustomerPayBillOnline',
                'Amount': str(amount),
                'PartyA': phone_number,
                'PartyB': self.short_code,
                'PhoneNumber': phone_number,
                'CallBackURL': callback_url,
                'AccountReference': f'Order_{order_id}',
                'TransactionDesc': 'Shoe Purchase'
            }
            logger.debug(f"Sending STK Push request: {payload}")
            response = requests.post(
                f'{self.api_url}/mpesa/stkpush/v1/processrequest',
                json=payload,
                headers=headers,
                timeout=30
            )
            response.raise_for_status()
            return response.json()
        except requests.RequestException as e:
            logger.error(f"STK Push request failed: {e}")
            raise

    def register_c2b_urls(self):
        try:
            access_token = self.get_access_token()
            headers = {'Authorization': f'Bearer {access_token}', 'Content-Type': 'application/json'}
            payload = {
                'ShortCode': self.short_code,
                'ValidationURL': self.callback_url.replace('callback', 'validation'),
                'ConfirmationURL': self.callback_url.replace('callback', 'confirmation'),
                'ResponseType': 'Completed'
            }
            logger.debug(f"Registering C2B URLs: {payload}")
            response = requests.post(
                f'{self.api_url}/mpesa/c2b/v1/registerurl',
                json=payload,
                headers=headers,
                timeout=10
            )
            response.raise_for_status()
            return response.json()
        except requests.RequestException as e:
            logger.error(f"C2B URL registration failed: {e}")
            raise

    def query_transaction_status(self, checkout_request_id):
        try:
            access_token = self.get_access_token()
            headers = {'Authorization': f'Bearer {access_token}', 'Content-Type': 'application/json'}
            timestamp = datetime.now().strftime('%Y%m%d%H%M%S')
            password = base64.b64encode(f"{self.short_code}{self.pass_key}{timestamp}".encode()).decode()
            payload = {
                'Initiator': self.initiator_name,
                'SecurityCredential': self.security_credential,
                'CommandID': 'TransactionStatusQuery',
                'TransactionID': checkout_request_id,
                'PartyA': self.short_code,
                'IdentifierType': '4',  # Shortcode
                'ResultURL': self.callback_url.replace('callback', 'status-result'),
                'QueueTimeOutURL': self.callback_url.replace('callback', 'status-timeout'),
                'Remarks': 'Status Check',
                'Occasion': 'Order Status'
            }
            logger.debug(f"Querying transaction status: {payload}")
            response = requests.post(
                f'{self.api_url}/mpesa/transactionstatus/v1/query',
                json=payload,
                headers=headers,
                timeout=10
            )
            response.raise_for_status()
            return response.json()
        except requests.RequestException as e:
            logger.error(f"Transaction status query failed: {e}")
            raise

    def initiate_b2c_refund(self, phone_number, amount, transaction_id, reason):
        try:
            access_token = self.get_access_token()
            headers = {'Authorization': f'Bearer {access_token}', 'Content-Type': 'application/json'}
            timestamp = datetime.now().strftime('%Y%m%d%H%M%S')
            payload = {
                'Initiator': self.initiator_name,
                'SecurityCredential': self.security_credential,
                'CommandID': 'BusinessPayment',
                'Amount': str(amount),
                'PartyA': self.short_code,
                'PartyB': phone_number,
                'Remarks': reason,
                'QueueTimeOutURL': self.callback_url.replace('callback', 'b2c-timeout'),
                'ResultURL': self.callback_url.replace('callback', 'b2c-result'),
                'Occasion': f'Refund for {transaction_id}'
            }
            logger.debug(f"Sending B2C refund request: {payload}")
            response = requests.post(
                f'{self.api_url}/mpesa/b2c/v1/paymentrequest',
                json=payload,
                headers=headers,
                timeout=30
            )
            response.raise_for_status()
            return response.json()
        except requests.RequestException as e:
            logger.error(f"B2C refund request failed: {e}")
            raise