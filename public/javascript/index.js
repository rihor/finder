const bodyElement = document.querySelector('body');
const translationFlag = document.querySelector('#flag-container img');
const containerOfFlags = document.getElementById('flag-options');

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

// <div id="loading-screen" class="hidden"></div>
const loadingScreen = document.getElementById('loading-screen');

// <div id="slides-container" class="slides-container"></div>
const slidesContainer = document.getElementById('slides-container');
const resultSearch = document.getElementById('result-search');
const btnPrevSlide = document.getElementById('prev');
const btnNextSlide = document.getElementById('next');

// determina uso de json
const jsonHeaders = new Headers({ 'Content-Type': 'application/json' });

let languageSelected = 'en';

actionContainer.addEventListener('click', startButtonClick);

// pega o input, envia para o servidor e
btnSearch.addEventListener('click', searchEvent);
inputSearch.addEventListener('keyup', event => {
  if (event.key === 'Enter') {
    btnSearch.click();
  }
});

translationFlagHandler(translationFlag);

// start now button
function startButtonClick() {
  closeWelcomeSection();
  changeSearchContainer();  
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
function showInfoSection(show = true) {
  // container de informação aparece
  infoSection.classList = show ? 'display' : 'hidden';
}

function showLoadingScreen(show = true) {
  loadingScreen.classList = show ? 'loading' : 'hidden';
}

function searchEvent() {
  removeSlides();
  showLoadingScreen();
  showSlideControls(false);

  // objeto que será passado para o server
  const searchInputs = {
    value: inputSearch.value,
    language: languageSelected,
  };

  // envia o texto para o servidor
  fetch('/', {
    method: 'POST',
    headers: jsonHeaders,
    body: JSON.stringify(searchInputs),
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
      showLoadingScreen(false);
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

  removeSlides();  

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
  showInfoSection();
  showSlideControls();
  
  // <div> <img src="..."/> </div>
  function createImageContainer({ images }) {
    let image = document.createElement('img');
    image.classList.add('slide-img');
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

function showSlideControls(show = true) {
  if(show) {
    btnPrevSlide.classList.remove('hidden');
    btnNextSlide.classList.remove('hidden');
    btnPrevSlide.classList.add('display');
    btnNextSlide.classList.add('display');
  }else {
    btnPrevSlide.classList.remove('display');
    btnNextSlide.classList.remove('display');
    btnPrevSlide.classList.add('hidden');
    btnNextSlide.classList.add('hidden');
  }
}

function removeSlides() {
  // remove todas os slides
  while (slidesContainer.firstChild) {
    slidesContainer.removeChild(slidesContainer.firstChild);
  }
}

function translationFlagHandler(flagShowing) {
  const languageArray = ['en', 'pt'];

  flagShowing.addEventListener('click', showFlagOptions);

  function showFlagOptions() {
    containerOfFlags.classList = 'flag-options';

    clearFlagList(containerOfFlags);

    for (const flagImage of languageArray) {
      let flagElement = document.createElement('img');
      flagElement.addEventListener('click', flagSelected);
      flagElement.src = `../images/flag_${flagImage}.png`;
      flagElement.name = flagImage;
      containerOfFlags.appendChild(flagElement);
    }
  }

  function clearFlagList(container) {
    while (container.firstChild) {
      container.removeChild(container.firstChild);
    }
  }

  function flagSelected(event) {
    let { src, name } = event.target;

    flagShowing.src = src;
    languageSelected = name;

    containerOfFlags.classList = 'hidden';
    setLanguage(languageSelected);
  }

  function setLanguage(languageSelected) {
    let input = {
      chosenLanguage: languageSelected,
    };

    fetch('/language', {
      method: 'POST',
      headers: jsonHeaders,
      body: JSON.stringify(input),
    })
      .then(() => {
        getAndApplyTranslation();
      })
      .catch(error => {
        console.warn('Failed changing page language!: ', error);
      });
  }

  function getAndApplyTranslation() {
    fetch('/translation')
      .then(response => response.json())
      .then(translation => {
        // aplica as traduções
        document.querySelector('#welcome-section h2').innerHTML =
          translation.subTitle;
        document.querySelector('#welcome-section p').innerHTML =
          translation.instructions;
        startButton.innerHTML = translation.button;
        document.querySelector('title').innerHTML = translation.title;
        document.querySelector('header nav a').innerHTML = translation.contact;
        inputSearch.placeholder = translation.inputPlaceholder;
        loadingScreen.querySelector('p').innerHTML = translation.loading;
      })
      .catch(error => console.warn(error));
  }
}
