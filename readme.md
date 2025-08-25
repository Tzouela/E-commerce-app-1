# Web Application: E-Commerce  
This is a full-stack E-Commerce application with a **Node.js/Express back-end** (MySQL + Sequelize + JWT authentication) and a **front-end Admin UI** built with EJS + Bootstrap. 

## Example `.env`

```env
PORT=3000
TOKEN_SECRET=your_jwt_secret
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
cd ../front-end && npm install
```

### 3. Run the back-end
```bash
cd back-end
npm start
```

API runs at 👉 http://localhost:3000  
Swagger docs 👉 http://localhost:3000/docs  

### 4. Run the front-end
```bash
cd front-end
npm start
```

- Admin UI runs at 👉 http://localhost:3001  

### 5. Run the back-end
```bash
cd back-end
npm start
```

- API runs at 👉 http://localhost:3000  
- Swagger docs available at 👉 http://localhost:3000/docs  

### 6. Run the front-end (Admin UI)
```bash
cd front-end
npm start
```

- Admin UI runs at 👉 http://localhost:3001  

## Libraries and Plugins

Include Bootstrap via CDN in your HTML (or EJS) template:

```html
<!-- Bootstrap CSS -->
<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.6/dist/css/bootstrap.min.css" rel="stylesheet">

<!-- Bootstrap Bundle with Popper -->
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.6/dist/js/bootstrap.bundle.min.js"></script>
```