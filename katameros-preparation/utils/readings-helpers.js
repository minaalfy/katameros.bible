const { BooksTranslations } = require('../constants/books-translations');
const { Feasts } = require('../constants/Feasts');
const { ReadingsMetadata } = require('../constants/readings-metadata');
const { SectionsMetadata } = require('../constants/sections-metadata');
const { SubSectionsMetadata } = require('../constants/sub-sections-metadata');
const { EReadingsMetadata } = require('../constants/readings-metadata-enum');
const { getBook } = require('./bible-helpers');

function getFeastTitle(feastId) {
  return Feasts[feastId - 1];
}

function getReadingMeta(readingId, readingMetaId) {
  return (
    ReadingsMetadata.find(
      (reading) =>
        reading.ReadingId === readingId &&
        reading.ReadingsMetadatasId === readingMetaId,
    )?.Text || ''
  );
}

function getSubSectionMeta(subsectionId, subsectionMetaId) {
  return (
    SubSectionsMetadata.find(
      (subsection) =>
        subsection.SubSectionsId === subsectionId &&
        subsection.SubSectionsMetadatasId === subsectionMetaId,
    )?.Text || ''
  );
}

function getSectionMeta(sectionId) {
  return (
    SectionsMetadata.find((section) => section.SectionsId === sectionId)
      ?.Text || ''
  );
}

function getRefs(refsStr) {
  let refs = refsStr.split(/\*@\+|@/g);
  let res = [];
  for (let refe of refs) {
    if (refe.indexOf(':') != refe.lastIndexOf(':')) {
      let p = refe.split(/-|:/g);
      let book = p[0].split('.')[0];
      let chapterBegin1 = p[0].split('.')[1];
      let verseBegin1 = p[1];
      let chapterBegin2 = p[2];
      let verseBegin2 = '1';
      let verseEnd2 = p[3];
      if (p.length > 4) {
        verseBegin2 = p[3];
        verseEnd2 = p[4];
      }

      res.push(`${book}.${chapterBegin1}:${verseBegin1}-end`);
      let chap1 = +chapterBegin1;
      let chap2 = +chapterBegin2;
      while (chap2 > chap1 + 1) {
        chap1++;
        res.push(`${book}.${chap1}:1-end`);
      }
      res.push(`${book}.${chapterBegin2}:${verseBegin2}-${verseEnd2}`);
    } else {
      res.push(refe);
    }
  }

  return res;
}

function makePassage(passageRef) {
  let passage = {};
  let splittedPassageRef = passageRef.split(/\.|:/g);
  passage.bookId = +splittedPassageRef[0];
  passage.chapter = +splittedPassageRef[1];
  let splittedVersesComma = null;
  let book = getBook(passage.bookId);
  let chapter = book.chapters[passage.chapter];
  let versesRef = splittedPassageRef[2];
  const verses = [];
  if (versesRef.includes('-')) {
    const splittedVerses = versesRef.split('-');
    const from = +splittedVerses[0];
    const to = splittedVerses[1] === 'end' ? -1 : +splittedVerses[1];
    if (to == -1) {
      Object.keys(chapter).forEach((v) => {
        if (+v >= from) {
          verses.push({
            number: +v,
            text: chapter[v],
          });
        }
      });
    } else {
      Object.keys(chapter).forEach((v) => {
        if (+v >= from && +v <= to) {
          verses.push({
            number: +v,
            text: chapter[v],
          });
        }
      });
    }
  } else if (versesRef.includes(',')) {
    splittedVersesComma = versesRef.split(',').map((i) => +i);
    Object.keys(chapter).forEach((v) => {
      if (splittedVersesComma?.includes(+v)) {
        verses.push({
          number: +v,
          text: chapter[v],
        });
      }
    });
  } else {
    Object.keys(chapter || {}).forEach((v) => {
      if (v === versesRef) {
        verses.push({
          number: +v,
          text: chapter[v],
        });
      }
    });
  }

  const bookTranslation = BooksTranslations[passage.bookId - 1];

  passage.bookTranslation = bookTranslation;
  passage.verses = verses;
  if (versesRef.includes(',')) {
    passage.verses = passage.verses.sort((v) =>
      splittedVersesComma.findIndex((s) => s == v.number),
    );
  }
  if (versesRef.includes('end'))
    versesRef = versesRef.replace(
      'end',
      passage.verses[passage.verses.length - 1]?.number.toString(),
    );
  passage.ref = `${passage.chapter}:${versesRef}`;
  return passage;
}

function makeReading(passagesRef, readingType) {
  let reading = {};
  let passages = [];
  let passageRefs = getRefs(passagesRef);
  for (let passageRef of passageRefs) {
    passages.push(makePassage(passageRef));
  }

  reading.passages = passages;
  reading.introduction =
    ReadingsMetadata.find(
      (m) =>
        m.ReadingId === readingType &&
        m.ReadingsMetadatasId === EReadingsMetadata.Introduction,
    )?.Text || '';
  reading.conclusion =
    ReadingsMetadata.find(
      (m) =>
        m.ReadingId === readingType &&
        m.ReadingsMetadatasId === EReadingsMetadata.Conclusion,
    )?.Text || '';
  return reading;
}

function numeriseEpistle(introduction, firstPassage) {
  if (introduction == null) return '';
  const first = introduction.indexOf('[');
  const last = introduction.lastIndexOf(']');
  if (first === -1 || last === -1) {
    return introduction;
  }
  const matches = introduction.match(/[^[\]]+(?=])/g);

  const matchesCount = matches?.length;

  const firstEpistle = matchesCount && matchesCount >= 1 ? matches[0] : 0;
  const secondEpistle = matchesCount && matchesCount >= 2 ? matches[1] : 0;
  const thirdEpistle = matchesCount && matchesCount >= 3 ? matches[2] : 0;

  const input = introduction;
  let epistleNumber = '';
  // First Corinthians, First Thessalonians, First Timothy, First Peter, First John
  const firstMessages = [46, 52, 54, 60, 62];
  // Second Corinthians, Second Thessalonians, Second Timothy, Second Peter, Second John
  const secondMessages = [47, 53, 55, 61, 63];
  if (firstEpistle && firstMessages.includes(firstPassage.bookId)) {
    epistleNumber = firstEpistle;
  } else if (secondEpistle && secondMessages.includes(firstPassage.bookId)) {
    epistleNumber = secondEpistle;
  } else if (thirdEpistle && firstPassage.bookId == 64) {
    // Third John
    epistleNumber = thirdEpistle;
  }
  const output =
    input.substring(0, first) + epistleNumber + input.substring(last + 1);
  return output;
}
const getScripture = (passages) => {
  let verses = '';
  for (let p of passages) {
    verses += `<sub>${p.bookTranslation} ${p.chapter}</sub>`;
    for (let v of p.verses) {
      verses += '<sup> ' + v.number + ' </sup>' + v.text;
    }
  }
  return verses;
};

module.exports = {
  getFeastTitle,
  getReadingMeta,
  getSubSectionMeta,
  getSectionMeta,
  numeriseEpistle,
  makeReading,
  makePassage,
  getScripture,
  getRefs,
};
