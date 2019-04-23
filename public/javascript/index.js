const welcomeSection = document.getElementById('welcome-section');
const infoSection = document.getElementById('info-section');
const actionContainer = document.querySelector('.container-action');
const startButton = document.querySelector('.btn-start');
const containerSearch = document.getElementById('container-search');
const resultImgSearch = document.getElementById('result-img-search');
const slidesContainer = document.getElementById('slides-container');
const inputSearch = document.getElementById('input-search');
const btnSearch = document.getElementById('btn-search');
const btnPrevSlide = document.querySelector('.prev');
const btnNextSlide = document.querySelector('.next');

// determina uso de json
const jsonHeaders = new Headers({ 'Content-Type': 'application/json' });
let slides = [];
let indexShowing = 0;

actionContainer.addEventListener('click', startButtonClick);

btnSearch.addEventListener('click', () => {
	event.preventDefault();

	// texto da pesquisa passado para JSON
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
			// pegara o resultado da pesquisa apenas depois dela acabar
			if (response.status == 200) {
				getContentFromServer();
			}
		})
		.catch(error => {
			console.warn('Failed sending content to search!: ', error);
		});
});

// pega o objeto com o resultado da pesquisa do servidor
function getContentFromServer() {
	fetch('/result', {
		method: 'GET',
		headers: jsonHeaders,
	})
		.then(res => res.json())
		.then(res => {
			// obtido o resultado da pesquisa
			displayImages(res);
		})
		.catch(error => {
			console.error('Failed retrieving content!: ', error);
		});
}

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

function displayImages({ images }) {

	// remove todas as imagens
	while (slidesContainer.firstChild) {
		slidesContainer.removeChild(slidesContainer.firstChild);
	}

	/* Cria a seguinte estrutura:
	 * <div class="img-slide">
	 * 		<img class="hidden">
	 * </div>
	 *
	 * depois de criar a estrutura passa cada slide criado para um array
	 */
	images.forEach(imgUrl => {
		let slideElement = document.createElement('div');
		slideElement.classList = 'img-slide';

		let imgElement = document.createElement('img');
		imgElement.src = imgUrl;
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
}

function moveSlide(event) {
	let lastIndex = slides.length - 1;
	
	slides[indexShowing].img.classList = 'hidden';

	if (event.target == btnNextSlide) {
		indexShowing++;
		if(indexShowing > lastIndex){
			indexShowing = 0;
		}
	}else{
		indexShowing--;
		if(indexShowing <= 0){
			indexShowing = lastIndex;
		}
	}
	slides[indexShowing].img.classList = 'display';
}
