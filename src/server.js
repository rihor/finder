const express = require('../node_modules/express');
const bodyParser = require('../node_modules/body-parser');
const path = require('path');

const app = express();
const content = require('../src/content');

app.use(express.static('public'));
app.use(bodyParser.json());
app.set('view engine', 'ejs');
// define a pasta onde está as views
app.set('views', path.join(__dirname, '../public/views'));

app.get('/', (req, res) => {
	res.render('index');
});

app.get('/result', (req, res) => {
	res.send(content);
});

app.post('/', (req, res) => {
	const getGoogleImages = require('./googleImages');

	let searchText = req.body.value;
	let promiseContent = getGoogleImages(searchText);

	// apenas ira enviar a confirmação depois de receber o resultado da promise
	promiseContent
		.then(() => {
			res.sendStatus(200);
		})
		.catch(error => {
			console.warn(error);
		});
});

app.listen(3000);
