const Sequelize = require('sequelize')
const fs = require("fs")
const path = require("path")
const basename = path.basename(__filename);
require('dotenv').config()

const connection = {
  dialect: process.env.DIALECT,
  database: process.env.DB_NAME,
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
   port: process.env.DB_PORT || 3306
}

const sequelize = new Sequelize(connection);

const db = {}
db.sequelize = sequelize
fs.readdirSync(__dirname)
  .filter(file => {
    return (file.indexOf('.') !== 0) && (file !== basename) &&
      (file.slice(-3) === '.js');
  })
  .forEach(file => {
    const model = require(path.join(__dirname, file))(sequelize,
      Sequelize);
    db[model.name] = model;
  });
Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

module.exports = db