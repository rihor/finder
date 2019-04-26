const express = require('express');

const routes = express.Router();
const content = require('./content');

routes.get('/', (req, res) => {
	res.render('index');
});

routes.get('/result', (req, res) => {
	res.send(content);
});

routes.post('/', (req, res) => {
	const getGoogleImages = require('./googleImages');

	let searchText = req.body.value;
	let promiseContent = getGoogleImages(searchText);

	promiseContent
		.then(() => {
			res.send();
		})
		.catch(error => {
			console.warn(error);
		});
});

module.exports = routes;
