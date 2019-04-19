const googleSearchCredentials = require('../credentials/google-search.json');
const google = require('../node_modules/googleapis').google;
const customSearch = google.customsearch('v1');

const content = require('./content');

async function getGoogleImages(query) {
	const imagesArray = await fetchGoogleAndReturnImagesLink(query);

	content.query = query;
	content.images = imagesArray;

	console.dir(content, { depth: null });

	async function fetchGoogleAndReturnImagesLink(query) {
		const response = await customSearch.cse.list({
			auth: googleSearchCredentials.apiKey,
			cx: googleSearchCredentials.searchEngineId,
			q: query,
			searchType: 'image',
			imgSize: 'huge',
			num: 3,
		});

		let items = response.data.items;

		if(items == undefined){
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
