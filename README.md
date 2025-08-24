# 👟 Shoe Haven - Full-Stack E-Commerce Platform

![Shoe Haven Hero Section](https://i.imgur.com/r6H5t1w.png) <!-- It's highly recommended to replace this with a screenshot of your actual home page -->

Shoe Haven is a complete, modern, and feature-rich e-commerce web application built from the ground up. It provides a seamless shopping experience for users, from browsing a dynamic, animated storefront to completing payments through multiple international and local gateways.

This project was built with a scalable and professional architecture, featuring a secure Flask REST API on the backend and a highly interactive React single-page application on the frontend, styled with Tailwind CSS.

**Live Demo:** [Link to your deployed application] <!-- Add your live demo link here when deployed -->

---

## ✨ Features

### Frontend (User Experience)
- **Stunning Animated Homepage:** A captivating hero section with a floating shoe showcase powered by Swiper.js.
- **Responsive & Dark Mode First:** A beautiful, mobile-friendly interface designed with Tailwind CSS.
- **Product Store & Filtering:** Browse products in a grid, with skeleton loading effects and advanced filtering by brand, price, and size.
- **Pagination:** Efficiently handles a large number of products.
- **Detailed Product Pages:** View product details, available stock, and select quantity before adding to the cart.
- **Comprehensive Authentication:**
    - Secure user registration and login with email/password.
    - Seamless social login with **Google OAuth 2.0**.
- **Dynamic Shopping Cart:** Add, remove, and update item quantities with real-time total calculations.
- **Multi-Gateway Checkout:**
    - Local payments with **M-Pesa STK Push**.
    - International payments with **PayPal Smart Buttons** (accepts PayPal & Debit/Credit Cards).
- **Real-Time Order Status:** A dedicated page that polls the backend to update users on their payment confirmation.
- **User Profile:** A protected page where users can view their complete order history.
- **PDF Receipt Downloads:** Users can download a PDF receipt for any completed order.
- **Professional UX:** Toast notifications for feedback, a floating WhatsApp button for support, and a responsive hamburger menu.

### Backend (API & Server)
- **Secure RESTful API:** Built with Flask and a modular blueprint architecture.
- **Token-Based Authentication:** Secured with JSON Web Tokens (JWT).
- **Robust Database Management:** Uses SQLAlchemy and Flask-Migrate for easy schema updates.
- **Complete Order Management:** Handles stock reduction on checkout and stock reversal on failed/cancelled payments.
- **Newsletter Subscription:** Captures user emails and sends an email notification to the store owner using Flask-Mail.
- **Secure Payment Verification:** All payment captures (M-Pesa & PayPal) are verified on the backend to prevent fraud.

---

## 🛠️ Tech Stack

| Backend | Frontend |
| :--- | :--- |
| **Python** | **React.js** (with Vite) |
| **Flask** (with Blueprints) | **Tailwind CSS** |
| **SQLAlchemy** (ORM) | **React Router** (for routing) |
| **SQLite / MySQL** (Database) | **Axios** (for API calls) |
| **Flask-JWT-Extended** (Auth) | **React Context API** (for state) |
| **Authlib** (Google OAuth) | **Swiper.js** (for carousels) |
| **Flask-Mail** (Email) | **@paypal/react-paypal-js** |
| **FPDF2** (PDF Generation) | **React Icons** & **React Toastify** |
| **Flask-CORS** | |

---

## 🚀 Getting Started

Follow these instructions to get a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

- **Node.js** (v18 or later)
- **Python** (v3.10 or later) & `pip`
- A **Google Cloud Platform** project with OAuth 2.0 credentials.
- A **PayPal Developer** account with Sandbox credentials.
- An **M-Pesa Developer** account with Sandbox credentials.

### Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/your-username/shoe-haven-final.git
    cd shoe-haven-final
    ```

2.  **Setup the Backend:**
    ```bash
    # Navigate to the backend directory
    cd backend

    # Create and activate a virtual environment
    python3 -m venv venv
    source venv/bin/activate
    # On Windows: venv\Scripts\activate

    # Install the required packages
    pip install -r requirements.txt

    # Create the .env file from the template (see below)
    cp .env.template .env 
    # Now, fill in your secret keys and credentials in the new .env file

    # Initialize and migrate the database
    flask db init  # Run only once for a new project
    flask db migrate -m "Initial migration"
    flask db upgrade

    # Populate the database with initial shoe data
    python populate_db.py

    # Run the Flask server
    python run.py
    ```
    The backend will be running at `http://127.0.0.1:5000`.

3.  **Setup the Frontend:**
    ```bash
    # Open a new terminal and navigate to the frontend directory
    cd frontend

    # Install the required packages
    npm install

    # Create the .env file from the template (see below)
    cp .env.template .env
    # Now, fill in your PayPal Client ID in the new .env file

    # Run the React development server
    npm run dev
    ```
    The frontend will be running at `http://localhost:5173`.

---

## 🔑 Environment Variables

You need to create `.env` files for both the backend and frontend. Use the `.env.template` files as a guide.

#### Backend (`backend/.env`)
```env
# ==================================
#      APPLICATION SECRETS
# ==================================
SECRET_KEY='a_very_strong_random_secret_key'
JWT_SECRET_KEY='another_super_strong_random_jwt_secret'

# ==================================
#      DATABASE CONFIGURATION
# ==================================
DATABASE_URL='sqlite:///instance/shoes.db'

# ==================================
#      FRONTEND URL
# ==================================
FRONTEND_URL='http://localhost:5173'

# ==================================
#      EMAIL CONFIGURATION
# ==================================
MAIL_SERVER=smtp.gmail.com
MAIL_PORT=587
MAIL_USE_TLS=True
MAIL_USERNAME=your-email@gmail.com
MAIL_PASSWORD=your-gmail-app-password
MAIL_DEFAULT_SENDER="Shoe Haven <your-email@gmail.com>"
NEWSLETTER_RECIPIENT=your-personal-email@example.com

# ==================================
#      GOOGLE OAUTH CONFIG
# ==================================
GOOGLE_CLIENT_ID="your_google_client_id.apps.googleusercontent.com"
GOOGLE_CLIENT_SECRET="your_google_client_secret"

# ==================================
#      PAYPAL CONFIGURATION
# ==================================
PAYPAL_CLIENT_ID="your_paypal_sandbox_client_id"
PAYPAL_CLIENT_SECRET="your_paypal_sandbox_secret"
PAYPAL_API_BASE=https://api-m.sandbox.paypal.com

# ==================================
#      M-PESA API CREDENTIALS
# ==================================
API_ENVIRONMENT=sandbox
CONSUMER_KEY=your_mpesa_consumer_key
CONSUMER_SECRET=your_mpesa_consumer_secret
PASS_KEY=your_mpesa_pass_key
BUSINESS_SHORT_CODE=174379
CALLBACK_URL=your_ngrok_or_public_domain/api/orders/callback

#FRONTEND ENV 
# The public PayPal Client ID for the frontend SDK
VITE_PAYPAL_CLIENT_ID="your_paypal_sandbox_client_id"