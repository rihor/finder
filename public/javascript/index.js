const mainBody = document.querySelector('section');
const actionContainer = document.querySelector('.container-action');

const actionBarButton = actionContainer.querySelector('button');
const form = actionContainer.querySelector('form');

actionContainer.addEventListener('click', () => {
	actionBarTransition();
});

function actionBarTransition() {
	mainBody.style.display = 'none';
  actionBarButton.style.display = 'none';
  form.style.display = 'block';
  actionContainer.style.cursor = 'default';
}
