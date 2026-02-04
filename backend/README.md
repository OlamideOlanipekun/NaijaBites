# NaijaBites Backend - Quick Start Guide

## Setup (5 Minutes)

### 1. Database Setup
```bash
# Navigate to phpMyAdmin: http://localhost/phpmyadmin
# Or use MySQL command line:
mysql -u root

# Import schema:
source C:/xampp/htdocs/naijabites/backend/database_schema.sql
```

### 2. Create Admin User
```bash
cd C:/xampp/htdocs/naijabites/backend/utils
php create_admin.php
```

Credentials created:
- Username: `admin`
- Password: `naijabites2024`

### 3. Test Backend
```bash
cd C:/xampp/htdocs/naijabites/backend
php test_connection.php
```

Should show: ✓ All green checkmarks

### 4. Test API Endpoint
Open browser: `http://localhost/naijabites/backend/api/public/menu.php`

Should return JSON with menu items.

## Update Paystack Keys

Edit `backend/.env`:
```env
PAYSTACK_SECRET_KEY=sk_test_your_actual_secret_key
PAYSTACK_PUBLIC_KEY=pk_test_your_actual_public_key
```

Edit frontend `.env`:
```env
VITE_PAYSTACK_PUBLIC_KEY=pk_test_your_actual_public_key
```

## Frontend Integration

The API service is ready at `services/api.ts`.

See [walkthrough.md](file:///C:/Users/Olamide/.gemini/antigravity/brain/406c035f-a54e-497c-a11f-d82a54d0a5d1/walkthrough.md) for complete integration examples.

## Production Deployment

1. Set `APP_ENV=production` in `backend/.env`
2. Use live Paystack keys
3. Update `VITE_API_BASE_URL` to production URL
4. Build frontend: `npm run build`
5. Deploy to server with HTTPS

## API Endpoints

**Public:**
- `GET /api/public/menu.php` - Menu items
- `POST /api/public/book_table.php` - Reservations
- `POST /api/public/orders/create_order.php` - Create order
- `GET /api/public/orders/verify_payment.php?reference=XXX` - Verify payment
- `POST /api/public/contact.php` - Contact form

**Admin (requires JWT):**
- `POST /api/admin/auth/login.php` - Login

## File Structure

```
backend/
├── .env                    ← Configure this!
├── database_schema.sql     ← Run this first
├── test_connection.php     ← Test setup
├── api/
│   ├── admin/auth/login.php
│   └── public/
│       ├── menu.php
│       ├── book_table.php
│       ├── contact.php
│       └── orders/
│           ├── create_order.php
│           └── verify_payment.php
├── config/
│   ├── env.php
│   ├── database.php
│   └── cors.php
├── core/
│   ├── JWTHandler.php
│   ├── Auth.php
│   └── Middleware.php
├── models/
│   ├── Menu.php
│   ├── Order.php
│   ├── Reservation.php
│   └── Contact.php
└── utils/
    ├── Response.php
    ├── helpers.php
    └── create_admin.php
```

## Support

See complete documentation in [walkthrough.md](file:///C:/Users/Olamide/.gemini/antigravity/brain/406c035f-a54e-497c-a11f-d82a54d0a5d1/walkthrough.md).
