const welcomeSection = document.getElementById('welcome-section');
const infoSection = document.getElementById('info-section');
const actionContainer = document.querySelector('.container-action');
const startButton = document.querySelector('.btn-start');
const containerSearch = document.getElementById('container-search');

const inputSearch = document.getElementById('input-search');
const btnSearch = document.getElementById('btn-search');

let searchContent = null;
let xhr = new XMLHttpRequest();

actionContainer.addEventListener('click', startButtonClick);

// determina uso de json
const jsonHeaders = new Headers({ 'Content-Type': 'application/json' });

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
		.then(result => {
			// obtido o resultado da pesquisa
			console.log(result);
		})
		.catch(error => {
			console.error('Failed retrieving content!: ', error);
		});
}

function startButtonClick() {
	closeWelcomeSection();
	changeSearchContainer();
	showInfoSection();
	actionContainer.removeEventListener('click', startButtonClick);
}

function closeWelcomeSection() {
	// start section desaparece
	welcomeSection.style.display = 'none';
}

function changeSearchContainer() {
	// start button desaparece
	startButton.classList = 'hidden';
	// container de pesquisa aparece
	containerSearch.classList = 'display';

	actionContainer.style.cursor = 'default';
}

function showInfoSection() {
	// container de informação aparece
	infoSection.classList = 'display';
}
