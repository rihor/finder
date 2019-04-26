const express = require('express');
const content = require('./content');

const routes = express.Router();

routes.get('/', (req, res) => {
	res.render('index');
});

routes.get('/result', (req, res) => {
	res.send(content);
});

routes.post('/', async (req, res) => {
  // query = texto da pesquisa
  content.query = req.body.value;
  
	const getGoogleImages = require('./robot-image');
	// const getWikiText = require('./robot-text');
  
  await getGoogleImages(content);
  // await getWikiText(content);

	console.log(content);

	res.send();
});

module.exports = routes;
