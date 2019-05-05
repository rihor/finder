const express = require('express');
const content = require('./content');
let { language } = require('./languages');

const routes = express.Router();

routes.get('/', (req, res) => {
  res.render('index');
});

routes.get('/result', (req, res) => {
  // para otimizar o envio do servidor para o client
  delete content.sourceContentOriginal;
  delete content.sourceContentSanitized;
  res.send(content);
});

routes.post('/', async (req, res) => {
  const { value, language } = req.body;

  content.query = value;
  content.language = language;

  const getGoogleImages = require('./robot-image');
  const getWikiText = require('./robot-text');

  await getWikiText(content);
  await getGoogleImages(content);

  console.dir(content, { depth: null });

  res.send();
});

routes.post('/language', async (req, res) => {
  const { chosenLanguage } = req.body;
  const { fetchLanguage } = require('./languages');
  
  language = await fetchLanguage(chosenLanguage);
  res.send();
});

routes.get('/translation', (req, res) => {
  // console.log(language);
  res.send(language);
});

module.exports = routes;
