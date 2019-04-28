const googleCredentials = require('../credentials/google.json');
const google = require('googleapis').google;
const customSearch = google.customsearch('v1');

async function getGoogleImages(content) {
	const imagesArray = await fetchGoogleAndReturnImagesLink(content);

	content.sentences.forEach((sentence, index) => {
		sentence.images = imagesArray[index];
	});

	async function fetchGoogleAndReturnImagesLink({ query }) {
		const response = await customSearch.cse.list({
			auth: googleCredentials.apiKey,
			cx: googleCredentials.searchEngineId,
			q: query,
			searchType: 'image',
			num: 5,
		});

		const items = response.data.items;

		if (items == undefined) {
			return items;
		}

		// cria um array com os links achados
		const imagesUrl = items.map(item => {
			return item.link;
		});

		return imagesUrl;
	}
}

module.exports = getGoogleImages;
