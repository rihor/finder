const express = require('../node_modules/express');
const bodyParser = require('../node_modules/body-parser');

const app = express();

app.use(express.static('public'));
app.use(bodyParser.json());
app.set('view engine', 'ejs');

app.get('/', (req, res) => {
	res.render('index');
});

app.post('/', (req, res) => {
	const getGoogleImages = require('./googleImages');

	let searchText = req.body.value;

	getGoogleImages(searchText);
});

app.listen(3000);
