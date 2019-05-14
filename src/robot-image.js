// const googleCredentials = require('../credentials/google.json');
const keys = require('../credentials/keys');
const google = require('googleapis').google;
const customSearch = google.customsearch('v1');

async function getGoogleImages({ sentences }) {
    // cada frase recebe um link de imagem
    for (const sentence of sentences) {
        const imgLink = await fetchGoogleAndReturnImagesLink(sentence);
        sentence.images.push(imgLink);
    }

    async function fetchGoogleAndReturnImagesLink({ keywords }) {
        const query = keywords.join(' ');

        const response = await customSearch.cse.list({
            // auth: googleCredentials.apiKey,
            // cx: googleCredentials.searchEngineId,
            auth: keys.googleApiKey,
            cx: keys.googleSearchEngineId,
            q: query,
            searchType: 'image',
            num: 1,
        });

        // const items = response.data.items;
        const { items } = response.data;

        if (items === undefined) {
            return undefined;
        }

        // cria um array com os links achados
        const imagesUrl = items.map(item => {
            return item.link;
        });

        return imagesUrl;
    }
}

module.exports = getGoogleImages;
