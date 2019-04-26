const algorithmia = require('algorithmia');
const apiKeys = require('../credentials/apiKeys.json');
const sentenceBoundaryDetection = require('sbd');

async function robot(content) {
	await fetchContentFromWikipedia(content);
	sanitizeContent(content);
  breakContentIntoSentences(content);

	async function fetchContentFromWikipedia(content) {
		const algorithmiaAuthenticated = algorithmia(apiKeys.algorithmia);
		const wikipediaAlgorithm = algorithmiaAuthenticated.algo('web/WikipediaParser/0.1.2');
		const wikipediaResponse = await wikipediaAlgorithm.pipe(content.query);
		const wikipediaContent = wikipediaResponse.get();

		content.sourceContentOriginal = wikipediaContent.content;
	}

	function sanitizeContent(content) {
		const withoutBlankLinesAndMarkdown = removeBlankLinesAndMarkdown(content.sourceContentOriginal);
		const withoutDatesInParentheses = removeDatesInParentheses(withoutBlankLinesAndMarkdown);

    content.sourceContentSanitized = withoutDatesInParentheses;

		// filtra as linhas que estiverem vazias
		function removeBlankLinesAndMarkdown(text) {
			const allLines = text.split('\n');

			const withoutBlankLinesAndMarkdown = allLines.filter(line => {
				if (line.trim().length === 0 || line.trim().startsWith('=')) {
					return false;
				}

				return true;
			});

			return withoutBlankLinesAndMarkdown.join(' ');
		}

		function removeDatesInParentheses(text) {
			return text.replace(/\((?:\([^()]*\)|[^()])*\)/gm, '').replace(/  /g, ' ');
		}
  }
  
  function breakContentIntoSentences(content) {
    content.sentences = [];

    const sentences = sentenceBoundaryDetection.sentences(content.sourceContentSanitized);
    sentences.forEach( sentence => {
      content.sentences.push({
        text: sentence,
        keywords: [],
        images: []
      });
    });
  }
}

module.exports = robot;
