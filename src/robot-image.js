const apiKeys = require('../credentials/apiKeys.json');
const google = require('googleapis').google;
const customSearch = google.customsearch('v1');

async function getGoogleImages(content) {
	const imagesArray = await fetchGoogleAndReturnImagesLink(content);

	content.images = imagesArray;

	async function fetchGoogleAndReturnImagesLink({ query }) {
		const response = await customSearch.cse.list({
			auth: apiKeys.google,
			cx: apiKeys.searchEngineId,
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
