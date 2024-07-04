// ? ----- [ Packages ] -----
const express = require('express');
const path = require("path");
const hbs = require("hbs");
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv/config');

// ? ----- [ Variables ] -----
const app = express();
const { cLog, startUp } = require('./APP/util/logger');

// ? ----- [ Express Config ] -----
app.use(cors());
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.options('*', cors());

// ? ----- [ Logger ] -----
startUp();

// ? ----- [ Routes ] -----
const auth = require('./APP/auth/routes');
const products = require('./APP/routes/products');
const stock = require('./APP/routes/stock');

app.use('/auth', auth);
app.use('/products', products);
app.use('/stock', stock);

// ? ----- [ Listen ] -----
const server = app.listen(process.env.PORT, () => {
    cLog(`Server started on port ${process.env.PORT}.`);
});

server.maxConnections = 100;