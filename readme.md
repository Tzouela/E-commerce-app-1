# E-commerce Backend API
Node.js | Express | MySQL | JWT Authentication

This is a backend-focused fullstack e-commerce application built with Node.js and Express.
The backend consists of 12 modular REST API routes organized into a dedicated service layer with 9 service classes following MVC architecture. The MySQL relational database includes 10 tables with a transactional checkout flow that handles stock validation, a membership-based discount calculator, and automatic order generation.
Authentication is implemented with JWT and Passport, with role-based access control for admin and regular users. The project includes API documentation with Swagger and integration tests with Jest and Supertest. Frontend and backend run as two independent applications with CORS configuration.

## Tech Stack

Backend
- Node.js
- Express.js
- MySQL
- Sequelize ORM

Authentication
- JWT
- Passport

Testing
- Jest
- Supertest

Documentation
- Swagger

## Key Features

- REST API built with Express
- MySQL relational database using Sequelize ORM
- JWT authentication and role-based access control
- Swagger API documentation
- API testing with Jest and Supertest
- Admin interface built with EJS and Bootstrap

## Example `.env`

```env
# App
PORT=3000
TOKEN_SECRET=your_jwt_secret

# Admin user bootstrap (first-time creation)
ADMIN_UI_HOST_URL=http://localhost:3001
ADMIN_UI_USERNAME=admin
ADMIN_UI_PASSWORD=changeme
ADMIN_UI_EMAIL=admin@example.com
ADMIN_UI_FIRST_NAME=Admin
ADMIN_UI_LAST_NAME=User
ADMIN_UI_ADDRESS=123 Admin Street
ADMIN_UI_TELEPHONE=1234567890

# External product API (used for demo product population)
PRODUCT_API_URL=http://backend.restapi.co.za/items/products

# Database
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=yourpassword
DB_NAME=ecommercedb
DIALECT=mysql
```

## Installation

### 1. Clone the repository
```bash
git clone https://github.com/Tzouela/E-commerce-app-1.git
cd E-commerce-app-1
```

### 2. Install dependencies
```bash
cd back-end && npm install
cd front-end && npm install
```

### 3. Run the back-end
```bash
cd back-end
npm start
```

API runs at 👉 http://localhost:3000  
Swagger docs 👉 http://localhost:3000/doc 

### 4. Run the front-end
```bash
cd front-end
npm start
```

- Admin UI runs at 👉 http://localhost:3001  

## Frontend Dependencies

Include Bootstrap via CDN in your HTML (or EJS) template:

```html
<!-- Bootstrap CSS -->
<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.6/dist/css/bootstrap.min.css" rel="stylesheet">

<!-- Bootstrap Bundle with Popper -->
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.6/dist/js/bootstrap.bundle.min.js"></script>
```
