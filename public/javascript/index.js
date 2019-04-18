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

btnSearch.addEventListener('click', () => {
	event.preventDefault();

	// envia a pesquisa para o backend
	xhr.open('POST', '/');
	xhr.setRequestHeader('Content-Type', 'application/json');
	xhr.send(JSON.stringify({ value: inputSearch.value }));
});

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