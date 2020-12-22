require("dotenv/config")
const express = require('express');
const path = require('path');

const app = express();

app.use(express.static('public'));
app.use(express.json());
app.set('view engine', 'ejs');
// define a pasta onde está as views
app.set('views', path.join(__dirname, '../public/views'));

app.use('/', require('./routes'));

const port = process.env.PORT || 3000;
app.listen(port);
