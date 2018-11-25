const express = require('express');
const bodyParser = require('body-parser');
const config = require('./config');
const app = express();
const mongoose = require('mongoose');

app.use(bodyParser.json({
    limit:'5mb'
}));
app.use(bodyParser.urlencoded({
    extended: false
}));
//habilita cors

app.use(function(req,res, next){
    res.header('Access-Control-Allow-Origin','*');
    res.header('Access-Control-Allow-Headers','Origin, X-Requested-With, Content-Type, Acept, x-access-token');
    res.header('Access-Control-Allow-Method','GET, POST, PUT, DELETE, OPTIONS');
    next();
});
const Product = require('./models/product');
const Customer = require('./models/customer');
const Order = require('./models/order');

//Contect to database
mongoose.connect(config.connectionstring);
//Cagar las rutas.
const index = require('./routes/index.js');
const product = require('./routes/product.js')
const customerRoute = require('./routes/customer-route.js')
const orderRoute = require('./routes/order-routes.js')

app.use('/', index);
app.use('/products', product)
app.use('/customers', customerRoute);
app.use('/orders', orderRoute);

module.exports = app;