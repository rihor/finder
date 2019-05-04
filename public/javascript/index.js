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

// <section id="info-section" class="hidden">
const slidesContainer = document.getElementById('slides-container');
const resultImgSearch = document.getElementById('result-img-search');
const btnPrevSlide = document.querySelector('.prev');
const btnNextSlide = document.querySelector('.next');

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

function searchEvent(event) {
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
		.then(response => {
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
		.then(response => {
			/**
			 * response:
			 * {
			 * 	query: searchedText
			 * 	images: [links]
			 * }
			 */
			displayImages(response);
		})
		.catch(error => {
			console.error('Failed retrieving content!: ', error);
		});
}

function displayImages({ sentences }) {
	/** 'slides' é um array de objetos, contendo a seguinte estrutura:
	 * [{
	 * 	slide: <div>,
	 *  img: <img>
	 * }]
	 */
	let slides = [];
	let indexShowing = 0; // index atual do slide

	// remove todas os slides
	while (slidesContainer.firstChild) {
		slidesContainer.removeChild(slidesContainer.firstChild);
	}

	/**Cria a seguinte estrutura:
	 * <div class="img-slide">
	 * 		<img class="hidden">
	 * </div>
	 * depois de criar a estrutura passa cada slide criado para um array
	 */
	sentences.forEach(sentence => {
		let slideElement = document.createElement('div');
		slideElement.classList = 'img-slide';

		let imgElement = document.createElement('img');
		imgElement.src = sentence.images;
		imgElement.classList = 'hidden';

		slideElement.appendChild(imgElement);
		slidesContainer.appendChild(slideElement);

		slides.push({
			slide: slideElement,
			img: imgElement,
		});
	});

	// a primeira imagem é visivel
	slides[indexShowing].img.classList = 'display';

	btnPrevSlide.addEventListener('click', moveSlide);
	btnNextSlide.addEventListener('click', moveSlide);

	infoSection.classList = 'display';
	resultImgSearch.classList += ' display';

	function moveSlide(event) {
		let lastIndex = slides.length - 1;

		slides[indexShowing].img.classList = 'hidden';

		if (event.target == btnNextSlide) {
			indexShowing++;
			if (indexShowing > lastIndex) {
				indexShowing = 0;
			}
		} else {
			indexShowing--;
			if (indexShowing <= 0) {
				indexShowing = lastIndex;
			}
		}
		slides[indexShowing].img.classList = 'display';
	}
}
