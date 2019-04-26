const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();

app.use(express.static('public'));
app.use(bodyParser.json());
app.set('view engine', 'ejs');
// define a pasta onde está as views
app.set('views', path.join(__dirname, '../public/views'));

app.use('/', require('./routes'));

app.listen(3000);
