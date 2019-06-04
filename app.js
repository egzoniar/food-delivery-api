const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const app = express();

const productRoutes = require('./api/routes/products');
const adminRoutes = require('./api/routes/admins');
const userRoutes = require('./api/routes/users');
const driverRoutes = require('./api/routes/drivers');
const latencyRoutes = require('./api/routes/latencies');
const orderRoutes = require('./api/routes/orders');

mongoose.connect(
    `mongodb+srv://vigan:${process.env.MONGO_PA}@fresca-api-lnzk0.mongodb.net/Fresca?retryWrites=true`
)
    .then(() => {
        console.log("Database is connected")
    })
    .catch(error => {
        console.log(error)
    })

mongoose.Promise = global.Promise;


app.use(morgan('dev'));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header(
        "Access-Control-Allow-Headers", 
        "Origin, X-Requested-With, Content-Type, Accept, Authorization"
    )
    if(req.method === 'OPTIONS') {
        res.header(
            'Access-Control-Allow-Methods', 
            'PUT, POST, PATCH, DELETE, GET'
        )
        return res.status(200).json({})
    }
    next();
})

app.use('/products', productRoutes);
app.use('/admins', adminRoutes);
app.use('/users', userRoutes);
app.use('/drivers', driverRoutes);
app.use('/latency', latencyRoutes);
app.use('/orders', orderRoutes)

app.use((req, res, next) => {
    const error = new Error('Not found');
    error.status = 404;
    next(error)
});

app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        error: {
            message: error.message
        }
    })
});

module.exports = app;