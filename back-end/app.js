var swaggerUi = require('swagger-ui-express')
var swaggerFile = require('./swagger-output.json')
var bodyParser = require('body-parser')
require('dotenv').config();
var createError = require('http-errors');
var express = require('express');
var cors = require('cors');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var passport = require('passport');
var session = require('express-session');
var SQLiteStore = require('connect-sqlite3')(session);

var initRouter = require('./routes/init');
var authRouter = require('./routes/auth');
var adminRouter = require('./routes/admin');
var usersRouter = require('./routes/users');
var rolesRouter = require('./routes/roles');
var membershipsRouter = require('./routes/memberships');
var productsRouter = require('./routes/products');
var categoriesRouter = require('./routes/categories');
var brandsRouter = require('./routes/brands');
var searchRouter = require('./routes/search');
var cartRouter = require('./routes/cart');
var ordersRouter = require('./routes/orders');
const { checkIfAuthorized } = require("./routes/authMiddleware");


var app = express();


app.use(cors({
  origin: 'http://localhost:3001', 
  credentials: true
}));


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');


app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
  secret: 'random text',
  resave: false,
  saveUninitialized: false,
  store: new SQLiteStore()
}));
app.use(passport.authenticate('session'));

app.use('/init', initRouter);
app.use('/auth', authRouter);
app.use('/admin', adminRouter);
app.use('/users', usersRouter);
app.use('/roles', rolesRouter);
app.use('/memberships', membershipsRouter);
app.use('/products', productsRouter);
app.use('/categories', categoriesRouter);
app.use('/brands', brandsRouter);
app.use('/search', searchRouter);
app.use('/cart', cartRouter);
app.use('/orders', ordersRouter);

app.use(bodyParser.json())
app.use('/doc', swaggerUi.serve, swaggerUi.setup(swaggerFile))

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
