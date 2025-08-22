# Web Application: E-Commerce  
This is a full-stack E-Commerce application with a **Node.js/Express back-end** (MySQL + Sequelize + JWT authentication) and a **front-end Admin UI** built with EJS + Bootstrap. 

## Example `.env`

Create a `.env` file in the `back-end/` folder. Use the following template and adjust values to your environment:

```env
# JWT
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
ADMIN_USERNAME = root
ADMIN_PASSWORD = yourpassword
DATABASE_NAME = ecommercedb
DIALECT = mysql
DIALECTMODEL = mysql2
PORT = 3000
HOST = localhost

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

### 3. Create the database (MySQL example)
```sql
CREATE DATABASE ecommercedb;
```

### 4. Run the back-end
```bash
cd back-end
npm run dev
```
- API runs at 👉 [http://localhost:3000](http://localhost:3000)  
- Swagger docs 👉 [http://localhost:3000/docs](http://localhost:3000/docs)

### 5. Run the front-end (Admin UI)
```bash
cd front-end
npm run dev
```
- Admin UI runs at 👉 [http://localhost:3001](http://localhost:3001)



# Web Application: E-commerce 

## Installation

1. Clone the repository to your local machine:

   ```bash
   git clone https://github.com/Tzouela/E-commerce-app-1.git
   ```

2. Install dependencies with command: 
```cd back-end && npm install```
```cd front-end && npm install```

3. Create a .gitignore file and exclude your node modules and .env file.

4. Create a .env file and copy the example .env and configure own database credentials.

5. Create database with the command: 
```create database ecommercedb```

6. Select the database and then run the application with the command: ```npm start```


## Libraries and Plugins

Ensure that your HTML file includes the following paths to successfully load the required resources:

- **Bootstrap CSS**:
  - Path: 'https://cdn.jsdelivr.net/npm/bootstrap@5.3.6/dist/css/bootstrap.min.css'
- **Bootstrap Popper (Bootstrap JS)**:
  - Path: 'https://cdn.jsdelivr.net/npm/@popperjs/core@2.11.8/dist/umd/popper.min.js'
- **Bootstrap Bundle (Bootstrap JS)**:
  - Path: 'https://cdn.jsdelivr.net/npm/bootstrap@5.3.6/dist/js/bootstrap.bundle.min.js'
