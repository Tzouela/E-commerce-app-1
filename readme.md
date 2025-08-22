# Example .env
ADMIN_USERNAME = 
ADMIN_PASSWORD = 
DATABASE_NAME = ecommercedb
DIALECT = mysql
DIALECTMODEL = mysql2
PORT = 3000
HOST = localhost

TOKEN_SECRET=

ADMIN_UI_HOST_URL= http://localhost:3001

ADMIN_UI_USERNAME=
ADMIN_UI_PASSWORD=
ADMIN_UI_EMAIL=
ADMIN_UI_FIRST_NAME=
ADMIN_UI_LAST_NAME=
ADMIN_UI_ADDRESS=
ADMIN_UI_TELEPHONE=

PRODUCT_API_URL= http://backend.restapi.co.za/items/products

# Web Application: E-commerce 

## Installation

1. Clone the repository to your local machine:

   ```bash
   git clone https://github.com/noroff-backend-1/aug24ft-ep-ca-1-Tzouela.git
   ```

2. Install dependencies with command: 
```npm install dotenv```

3. Create a .gitignore file and exclude your node modules and .env file(example .env above)

4. Create a .env file and copy the example .env and configure own database credentials.

5. Create database with the command: 
```create database ecommercedb```

6. Select the database and then run the application with the command: ```npm start```

7. Once your database and tables you are ready to use the app(check API Swagger Documentation)

## Libraries and Plugins

Ensure that your HTML file includes the following paths to successfully load the required resources:

- **Bootstrap CSS**:
  - Path: 'https://cdn.jsdelivr.net/npm/bootstrap@5.3.6/dist/css/bootstrap.min.css'
- **Bootstrap Popper (Bootstrap JS)**:
  - Path: 'https://cdn.jsdelivr.net/npm/@popperjs/core@2.11.8/dist/umd/popper.min.js'
- **Bootstrap Bundle (Bootstrap JS)**:
  - Path: 'https://cdn.jsdelivr.net/npm/bootstrap@5.3.6/dist/js/bootstrap.bundle.min.js'


## REFERENCES

My initial creation of code was based on the lessons. Besides that, I have also worked with AI tools to assist me put together my raw ideas for the creation of this work that I am presenting. 

Below are references of external resources that I have used:
- ChatGPT, for helping me to search specific javascript syntaxes for my algorithms.
- Copilot in Visual Studio Code, for helping complete lines of my codes.
- Method-override for front-end: 'https://mohammdowais.medium.com/sending-put-and-delete-requests-through-html-f9ffe9e1b6cb'.