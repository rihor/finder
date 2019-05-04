// <section id="welcome-section" class="welcome-section-style">
const welcomeSection = document.getElementById('welcome-section');

// <div class="container-action">
const actionContainer = document.querySelector('.container-action');
const startButton = document.querySelector('.btn-start');

// <div id="container-search" class="hidden">
const containerSearch = document.getElementById('container-search');
const inputSearch = document.getElementById('input-search');
const btnSearch = document.getElementById('btn-search');

// <section id="info-section" class="hidden">
const infoSection = document.getElementById('info-section');

// <div id="slides-container" class="slides-container"></div>
const slidesContainer = document.getElementById('slides-container');
const resultSearch = document.getElementById('result-search');
const btnPrevSlide = document.getElementById('prev');
const btnNextSlide = document.getElementById('next');

// determina uso de json
const jsonHeaders = new Headers({ 'Content-Type': 'application/json' });

actionContainer.addEventListener('click', startButtonClick);

// pega o input, envia para o servidor e
btnSearch.addEventListener('click', searchEvent);
inputSearch.addEventListener('keyup', event => {
  if (event.key === 'Enter') {
    btnSearch.click();
  }
});

// start now button
function startButtonClick() {
  closeWelcomeSection();
  changeSearchContainer();
  showInfoSection();
  actionContainer.removeEventListener('click', startButtonClick);
}

// start section desaparece
function closeWelcomeSection() {
  welcomeSection.classList = ' hidden';
}

// faz desaparecer o start now button
// e faz aparecer o container de pesquisa
function changeSearchContainer() {
  // start button desaparece
  startButton.classList = 'hidden';
  // container de pesquisa aparece
  containerSearch.classList = 'display';
  actionContainer.style.cursor = 'default';
}

// a seção de informações aparece
function showInfoSection() {
  // container de informação aparece
  infoSection.classList = 'display';
}

function searchEvent() {
  // objeto com o texto do input
  const searchInputValue = {
    value: inputSearch.value,
  };

  // envia o texto para o servidor
  fetch('/', {
    method: 'POST',
    headers: jsonHeaders,
    body: JSON.stringify(searchInputValue),
  })
    .then(() => {
      getContentFromServer();
    })
    .catch(error => {
      console.warn('Failed sending content to search!: ', error);
    });
}

// pega o objeto com o resultado da pesquisa do servidor
function getContentFromServer() {
  fetch('/result')
    .then(response => response.json())
    .then(content => {
      displaySearchResult(content);
    })
    .catch(error => {
      console.error('Failed retrieving content!: ', error);
    });
}

function displaySearchResult({ sentences }) {
  let slides = [];
  let indexShowing = 0; // index atual do slide

  btnPrevSlide.addEventListener('click', moveSlide);
  btnNextSlide.addEventListener('click', moveSlide);

  // remove todas os slides
  while (slidesContainer.firstChild) {
    slidesContainer.removeChild(slidesContainer.firstChild);
  }

  sentences.forEach(sentence => {
    let imageContainer = createImageContainer(sentence);
    let textContainer = createTextContainer(sentence);

    let slide = document.createElement('div');
    slide.classList.add('hidden');
    slide.appendChild(imageContainer);
    slide.appendChild(textContainer);

    // coloca o novo slide no container de slides
    slidesContainer.appendChild(slide);
    slides.push(slide);
  });

  showSlide(indexShowing);
  infoSection.classList.add('display');
  btnPrevSlide.classList += ' display';
  btnNextSlide.classList += ' display';

  // <div> <img src="..."/> </div>
  function createImageContainer({ images }) {
    let image = document.createElement('img');
    image.src = images;

    let imageContainer = document.createElement('div');
    imageContainer.classList.add('img-container');
    imageContainer.appendChild(image);

    return imageContainer;
  }

  // <div> <p>...</p> </div>
  function createTextContainer({ text }) {
    let textElement = document.createElement('p');
    let textNode = document.createTextNode(text);
    textElement.appendChild(textNode);

    let textContainer = document.createElement('div');
    textContainer.classList.add('sentence');
    textContainer.appendChild(textElement);

    return textContainer;
  }

  function showSlide(index) {
    slides[index].classList.add('slide');
  }

  function moveSlide(event) {
    let lastIndex = slides.length - 1;

    slides[indexShowing].classList = 'hidden';

    if (event.target == btnNextSlide) {
      indexShowing++;
      if (indexShowing > lastIndex) {
        indexShowing = 0;
      }
    } else {
      indexShowing--;
      if (indexShowing < 0) {
        indexShowing = lastIndex;
      }
    }
    showSlide(indexShowing);
  }
}
