const startSection = document.querySelector('section');
const actionContainer = document.querySelector('.container-action');
const startButton = document.getElementById('btn-start');
const containerSearch = document.getElementById('container-search');

const inputSearch = document.getElementById('input-search');
const btnSearch = document.getElementById('btn-search');

let searchContent = null;
let xhr = new XMLHttpRequest();

actionContainer.addEventListener('click', startButtonClick);

btnSearch.addEventListener('click', () => {
	event.preventDefault();

	xhr.open('POST', '/');
	xhr.setRequestHeader('Content-Type', 'application/json');
	xhr.send(JSON.stringify({ value: inputSearch.value }));
});

function startButtonClick() {
	// start section desaparece
	startSection.style.display = 'none';
	// start button desaparece
	startButton.style.display = 'none';
	// container de pesquisa aparece
	containerSearch.style.display = 'flex';

	actionContainer.style.cursor = 'default';
	actionContainer.removeEventListener('click', startButtonClick);
}