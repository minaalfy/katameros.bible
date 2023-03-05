const { BooksTranslations } = require('../constants/books-translations');
const { EReadingType } = require('../constants/reading-type');
const { EReadingsMetadata } = require('../constants/readings-metadata-enum');
const { ESectionType } = require('../constants/section-type');
const { ESubSectionType } = require('../constants/sub-section-type');
const {
  ESubSectionsMetadata,
} = require('../constants/sub-sections-metadata-enum');
const {
  getReadingMeta,
  getRefs,
  getSectionMeta,
  getSubSectionMeta,
  makeReading,
  numeriseEpistle,
  getScripture,
} = require('./readings-helpers');

function createHTML(subSections) {
  let html = '';
  subSections.forEach((sub) => {
    html += `<div><h4 class="text-center text-xl kufi">${sub.title}</h4>`;
    if (sub.introduction)
      html += `<p class="subsection-introduction">${sub.introduction}</p>`;
    sub.readings.forEach((reading) => {
      if (reading.introduction)
        html += `<p class="reading-introduction">${reading.introduction}</p>`;
      html += `<p>${getScripture(reading.passages)}</p>`;
      if (reading.conclusion)
        html += `<p class="reading-conclusion">${reading.conclusion}</p>`;
    });
    html += '</div>';
  });
  return html;
}
// #region Liturgy
function makePauline(paulineRef) {
  const subSection = { id: ESubSectionType.Pauline };
  const reading = makeReading(paulineRef, EReadingType.Pauline);
  const firstPassage = reading.passages[0];
  const recipient = BooksTranslations[firstPassage.bookId - 1].match(/^\d+/)
    ? BooksTranslations[firstPassage.bookId - 1].substring(2)
    : BooksTranslations[firstPassage.bookId - 1];

  if (reading.introduction) {
    reading.introduction = reading.introduction.replace('$', recipient);
    reading.introduction = numeriseEpistle(reading.introduction, firstPassage);

    var first = reading.introduction.indexOf('[');
    var last = reading.introduction.lastIndexOf(']');

    if (first != -1 && last != -1) {
      const matches = reading.introduction.match(/[^[\]]+(?=])/g);

      const singular = matches[0];
      const plural = matches[1];

      let input = reading.introduction;
      let noun = plural;
      // Titus, Philemon, James, Timothy
      const singularMessages = [56, 57, 59, 55];
      if (singularMessages.includes(firstPassage.bookId)) {
        noun = singular;
      }
      const output =
        input.substring(0, first) +
        noun +
        input.substring(last + 1, input.length - 1 - last);
      reading.introduction = output;
    }
  }
  subSection.title = getReadingMeta(
    EReadingType.Pauline,
    EReadingsMetadata.Title,
  );

  subSection.readings = [reading];
  return subSection;
}
function makeCatholic(catholicRef) {
  const subSection = { id: ESubSectionType.Catholic };
  const reading = makeReading(catholicRef, EReadingType.Catholic);

  const firstPassage = reading.passages[0];
  const author = BooksTranslations[firstPassage.bookId - 1].match(/^\d+/)
    ? BooksTranslations[firstPassage.bookId - 1].substring(2)
    : BooksTranslations[firstPassage.bookId - 1];
  reading.introduction = reading.introduction?.replace('$', author);
  reading.introduction = numeriseEpistle(reading.introduction, firstPassage);

  subSection.readings = [reading];
  subSection.title = getReadingMeta(
    EReadingType.Catholic,
    EReadingsMetadata.Title,
  );
  return subSection;
}
function makeActs(actsRef) {
  const subSection = { id: ESubSectionType.Acts };
  const reading = makeReading(actsRef, EReadingType.Acts);

  subSection.title = getReadingMeta(EReadingType.Acts, EReadingsMetadata.Title);
  subSection.readings = [reading];
  return subSection;
}
function makeLitugy(paulineRef, catholicRef, actsRef, psalmRef, gospelRef) {
  const section = { id: ESectionType.Liturgy };
  const subSections = [];
  section.title = getSectionMeta(ESectionType.Liturgy);
  subSections.push(makePauline(paulineRef));
  subSections.push(makeCatholic(catholicRef));
  subSections.push(makeActs(actsRef));
  if (psalmRef !== 'null' && gospelRef !== 'null') {
    subSections.push(makePsalmAndGospel(psalmRef, gospelRef));
  }
  return createHTML(subSections);
}
// #endregion

// #region Psalm And Gospel
function makePsalmAndGospel(psalmRef, gospelRef) {
  const subSection = {
    id: ESubSectionType.PsalmAndGospel,
  };
  const readings = [];
  subSection.introduction = getSubSectionMeta(
    ESubSectionType.PsalmAndGospel,
    ESubSectionsMetadata.Introduction,
  );
  if (psalmRef) {
    readings.push(makeReading(psalmRef, EReadingType.Psalm));
  }
  const gospel = makeReading(gospelRef, EReadingType.Gospel);
  const evangelist =
    gospel.passages[0].bookTranslation !== null
      ? gospel.passages[0].bookTranslation /*.Where(char.IsLetter)*/
      : '';
  if (!psalmRef) gospel.introduction = '';
  else if (gospel.introduction && gospel.introduction.includes('$')) {
    gospel.introduction = gospel.introduction.replace('$', evangelist);
  }
  readings.push(gospel);
  subSection.title = getSubSectionMeta(
    ESubSectionType.PsalmAndGospel,
    ESubSectionsMetadata.Title,
  );
  subSection.introduction = subSection.introduction?.replace('$', evangelist);
  subSection.readings = readings;
  return subSection;
}
function makePsalmsAndGospels(gospelRefs, psalmRefs) {
  const subSection = {
    id: ESubSectionType.PsalmAndGospel,
  };
  const readings = [];
  psalmRefs.forEach((psalmRef) => {
    readings.push(makeReading(psalmRef, EReadingType.Psalm));
  });
  gospelRefs.forEach((gospelRef) => {
    readings.push(makeReading(gospelRef, EReadingType.Gospel));
  });

  subSection.title = getSubSectionMeta(
    ESubSectionType.PsalmAndGospel,
    ESubSectionsMetadata.Title,
  );
  subSection.readings = readings;
  return subSection;
}
// #endregion

// #region Matins
function makeMatins(psalmRef, gospelRef, prophecyRef) {
  const section = { id: ESectionType.Matins };
  const subSections = [];
  section.title = getSectionMeta(ESectionType.Matins);

  if (prophecyRef && prophecyRef.length > 1)
    subSections.push(makeProphecies(prophecyRef));
  subSections.push(makePsalmAndGospel(psalmRef, gospelRef));

  return createHTML(subSections);
}
// #endregion

// #region Prophecies
function makeProphecies(prophecyRef) {
  const subSection = { id: ESubSectionType.Prophecy };
  const readings = [];
  subSection.title = getSubSectionMeta(
    ESubSectionType.Prophecy,
    ESubSectionsMetadata.Title,
  );
  const prophecyConclusion = getReadingMeta(
    EReadingType.Prophecy,
    EReadingsMetadata.Conclusion,
  );
  const refs = getRefs(prophecyRef);
  for (let readingRef of refs) {
    const reading = makeReading(readingRef, EReadingType.Prophecy);
    reading.conclusion = prophecyConclusion;
    const last = readings[readings.length - 1];
    if (
      last &&
      last.passages[0].bookId === reading.passages[0].bookId &&
      last.passages[0].chapter === reading.passages[0].chapter - 1 &&
      reading.passages[0].verses[0]?.number == 1
    ) {
      last.passages.push(reading.passages[0]);
    } else {
      readings.push(reading);
    }
  }
  subSection.readings = readings;
  return subSection;
}
// #endregion

// #region OldTestament
function makeOldTestament(passageRef) {
  const subSection = {
    id: ESubSectionType.Prophecy,
  };
  const readings = [];
  subSection.title = getSubSectionMeta(
    ESubSectionType.Prophecy,
    ESubSectionsMetadata.Title,
  );
  const conclusion = getReadingMeta(
    EReadingType.Prophecy,
    EReadingsMetadata.Conclusion,
  );
  const refs = getRefs(passageRef);
  for (let readingRef of refs) {
    const reading = makeReading(readingRef, EReadingType.Prophecy);
    reading.conclusion = conclusion;
    const last = readings[readings.length - 1];
    if (
      last &&
      last.passages[0].bookId === reading.passages[0].bookId &&
      last.passages[0].chapter === reading.passages[0].chapter - 1 &&
      reading.passages[0].verses[0]?.number == 1
    ) {
      last.passages.push(reading.passages[0]);
    } else readings.push(reading);
  }

  subSection.readings = readings;
  return subSection;
}
// #endregion

// #region Vespers
function makeVespers(psalmRef, gospelRef, prophecyRef) {
  const subSections = [];
  if (prophecyRef) subSections.push(makeProphecies(prophecyRef));

  subSections.push(makePsalmAndGospel(psalmRef, gospelRef));
  return createHTML(subSections);
}
// #endregion
module.exports = {
  makeVespers,
  makeProphecies,
  makePsalmAndGospel,
  makePsalmsAndGospels,
  makeOldTestament,
  makeLitugy,
  makeMatins,
};
