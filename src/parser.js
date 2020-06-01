const axios = require('axios');
const { JSDOM } = require('jsdom');

const toRemoveClassName = [
  '.cid',
  '.daud',
  '.dwla',
  '.gram',
  '.daccord',
  '.grammar',
  '.idiom',
  '.idioms',
  '.synonyms',
  '.compare',
  '.related_word',
  '.phrasal_verb',
  '.phrasal_verbs',
  '.hfr',
  '.phrase-block',
  '.dimg',
  '.contentslot',
];

module.exports = function (word) {
  return new Promise(function (resolve, reject) {
    let template;
    JSDOM.fromFile('./public/index.html').then((dom) => {
      template = dom;
    });
    axios
      .get(`https://dictionary.cambridge.org/us/dictionary/english/${word}`, {
        headers: { 'Accept-Encoding': 'gzip, deflate, br' },
      })
      .then((res) => {
        const domDictionary = new JSDOM(res.data);
        const documentDictionary = domDictionary.window.document;

        template.window.document.querySelector('.content').append(documentDictionary.querySelector('.entry-body'));
        toRemoveClassName.forEach((classname) =>
          template.window.document
            .querySelectorAll(classname)
            .forEach((element) => element.parentNode.removeChild(element))
        );
        template.window.document.querySelectorAll('a').forEach((element) => (element.href = `/${element.title}`));
        resolve(template.serialize());
      })
      .catch((err) => reject(err));
  });
};
