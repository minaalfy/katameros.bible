const fs = require('fs');
const bcv_parser =
  require('bible-passage-reference-parser/js/ar_bcv_parser').bcv_parser;
const bcv = new bcv_parser();
const { info } = require('./bible-info.min');

const books = {};
function getBook(b) {
  let book;
  if (books[b]) {
    book = books[b];
  } else {
    const response = fs.readFileSync(
      './katameros-preparation/data/books/' + b + '.json',
    );
    book = JSON.parse(response);
    books[b] = book;
  }
  return book;
}

function getChapter(b, c, v) {
  const book = getBook(b);
  return v ? book.chapters[c][v] : getFullChapter(book.chapters[c]);
}

function getFullChapter(chapter) {
  let verses = '';
  Object.keys(chapter).forEach((verseIndex) => {
    verses += '<sup> ' + verseIndex + ' </sup>' + chapter[verseIndex];
  });
  return verses;
}

function getScripture(b, c, start, verseEnd) {
  let verses = '';
  if (!verseEnd) return verses;
  const book = getBook(b);
  const secondChapterNum = verseEnd.split('.')[1];
  if (secondChapterNum !== c) {
    const firstChapter = book.chapters[c];
    for (let i = +start; i <= Object.keys(firstChapter).length - 1; i++) {
      verses += '<sup> ' + i + ' </sup>' + firstChapter[i];
    }
    verses +=
      '<br/><sup>اصحاح' +
      secondChapterNum +
      ' </sup>' +
      getScripture(b, secondChapterNum, 1, verseEnd);
  } else {
    const chapter = book.chapters[c];
    for (let i = +start; i <= +verseEnd.split('.')[2]; i++) {
      verses += '<sup> ' + i + ' </sup>' + chapter[i];
    }
  }
  return verses;
}

function passageParser(cleanedArticleContent) {
  const toEnglish = (s) => s.replace(/[٠-٩]/g, (d) => '٠١٢٣٤٥٦٧٨٩'.indexOf(d));
  const toArabic = (s) => s.replace(/\d/g, (d) => '٠١٢٣٤٥٦٧٨٩'[d]);

  const regex =
    /(([^()]+([0-9\u0660-\u0669]\s*)*([a-zA-Z\u0600-\u06FF]*\s*[0-9\u0660-\u0669])+)\))/g;
  const matches = cleanedArticleContent.match(regex);
  if (matches) {
    matches.forEach(async (element) => {
      const rtlString =
        '\u200F' +
        toArabic(element)
          .replace(':', '\u200F' + ':' + '\u200F')
          .replace('-', '-' + '\u200F')
          .replace(')', '');
      const [startVerses, endVerses] = bcv
        .parse(toEnglish(element))
        .osis()
        .split('-');
      const startVerse = startVerses.split(',')[0];
      let endVerse;
      if (endVerses) endVerses.split(',')[0];
      const [bookName, chapter, startNum] = startVerse.split('.');
      const bookNum =
        info.books.findIndex((a) => a.synonyms.includes(bookName)) + 1;

      const scripture =
        endVerse && endVerse !== 'undefined'
          ? await getChapter(bookNum, chapter, startNum)
          : await getScripture(bookNum, chapter, startNum, endVerse);

      cleanedArticleContent = cleanedArticleContent.replace(
        element,
        `<span class="verse" @click="$tooltip('${scripture}',{allowHTML: true})">${rtlString}</span>)`,
      );
    });
  }
  return cleanedArticleContent;
}
module.exports = {
  getBook,
  getChapter,
  getFullChapter,
  getScripture,
  passageParser,
};
