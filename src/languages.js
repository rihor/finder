language = {};

const brLang = {
  language: 'pt',
  title: 'Explore o mundo',
  subTitle: 'Explore qualquer coisa que você quiser!',
  instructions:
    'Apenas clique em começar e insira alguma coisa, a página então irá procurar sobre o assunto!',
  button: 'Começar',
  contact: 'Contato',
};

const enLang = {
  language: 'en',
  title: 'Explore the world',
  subTitle: 'Explore anything you want!',
  instructions:
    'Just click start and enter anything on the input, the page will search it and show all about to you!',
  button: 'Start now',
  contact: 'Contact',
};

async function fetchLanguage(language) {
  switch (language) {
    case brLang.language:
      return brLang;
    case enLang.language:
    default:
      return enLang;
  }
}

module.exports = {
  fetchLanguage,
  language
}
