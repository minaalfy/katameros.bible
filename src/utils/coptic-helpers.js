const copticMonths = {
  '01': 'توت',
  '02': 'بابه',
  '03': 'هاتور',
  '04': 'كيهك',
  '05': 'طوبه',
  '06': 'امشير',
  '07': 'برمهات',
  '08': 'برموده',
  '09': 'بشنس',
  10: 'بؤونه',
  11: 'ابيب',
  12: 'مسرا',
  13: 'نسيئ',
};
export function addDays(date, days) {
  var result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

export function getEasterDate(year) {
  let A = year % 19;
  let B = year % 4;
  let C = year % 7;
  let X = (19 * A + 16) % 30;
  let Y = (2 * B + (4 * C + 6 * X)) % 7;
  let EasterTime = new Date(year, 2, 31, 0, 0, 0); //new DateTime(GYear, 3, 31, 0, 0, 0);
  EasterTime = addDays(EasterTime, X + (Y + 3));
  return EasterTime;
}

export function getPentecost(year) {
  var easterTime = getEasterDate(year);
  return addDays(easterTime, 49);
}

export function getGreatLentPeriod(year) {
  const easterTime = getEasterDate(year);
  const GreatLentBeginning = addDays(easterTime, -55);
  const GreatLentEnding = addDays(easterTime, -9);
  return [GreatLentBeginning, GreatLentEnding];
}

// Coptic date
export function getCopticDate(date = new Date()) {
  const { day, month, year } = new Intl.DateTimeFormat('en-u-ca-coptic', {
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
  })
    .formatToParts(date)
    .reduce((acc, part) => {
      if (part.type != 'literal') {
        acc[part.type] = part.value;
      }
      return acc;
    }, Object.create(null));
  return { day, month, year };
}

// export function isLastSundayOfMonth(date, day) {
//   return day === 0 && date + 7 > 30;
// }

// export function numberOfElapsedSundays(date) {
//   const days = date.getDate();
//   const firstDay = new Date(
//     date.getMonth() + 1 + '/01/' + date.getFullYear(),
//   ).getDay();
//   const sundays = [8 - (firstDay || 7)];
//   for (let i = sundays[0] + 7; i < days; i += 7) {
//     sundays.push(i);
//   }
//   return sundays.length;
// }

// export async function kiahkSpecialCases(gregorianDate) {
//   const copticDate = getCopticDate(gregorianDate);
//   const isKiahk = copticDate.month == ECopticMonths.Kiahk;
//   const christmasDate = new Date(gregorianDate.getFullYear(), 1, 7);
//   //  If the day which follows Christmas is on a sunday we read the 30 kiahk annual reading, and not the lessons of the fifth Sunday
//   if (isKiahk && gregorianDate.getDay() == 0 && copticDate.day == 30) {
//     return getReadingsForAnnual({
//       year: copticDate.year,
//       month: ECopticMonths.Kiahk,
//       day: 30,
//     });
//   }

//   //  If Christmas fall on 28 kiahk we repeat the readings for 29 Kiahk also
//   if (
//     isKiahk &&
//     copticDate.day == 29 &&
//     getCopticDate(christmasDate).day == 28
//   ) {
//     return getReadingsForAnnual({
//       year: copticDate.year,
//       month: ECopticMonths.Kiahk,
//       day: 29,
//     });
//   }

//   //  If the fourth Sunday of Kiyahk falls immediately before the Nativity
//   //  This means that the month of Kiyahk would be left with only three Sundays
//   //  The fifth Sunday of Hatour is borrowed and added to the three Sundays of Kiyahk
//   const paramounDate = new Date(gregorianDate.getFullYear() + 1, 1, 6);
//   //  The next (gregorian year's) paramoun
//   if (paramounDate.getDay() == 0 && gregorianDate.getDay() == 0) {
//     const nbSundays = numberOfElapsedSundays(gregorianDate);
//     if (
//       copticDate.month == ECopticMonths.Hatour &&
//       isLastSundayOfMonth(copticDate.day, gregorianDate.getDay())
//     ) {
//       return await getReadingsForSunday(ECopticMonths.Kiahk, 1);
//     } else if (copticDate.month === ECopticMonths.Kiahk) {
//       return await getReadingsForSunday(ECopticMonths.Kiahk, nbSundays + 1);
//     }
//   }
//   return false;
// }

export function daysDiff(first, second) {
  return Math.round(
    (second.getTime() - first.getTime()) / (1000 * 60 * 60 * 24),
  );
}

export function getCopticMonth(month) {
  return Object.keys(copticMonths).includes(month) ? copticMonths[month] : '';
}
export const e2a = (s) => s.replace(/\d/g, (d) => '٠١٢٣٤٥٦٧٨٩'[d]);

export function isLeapYear(year) {
  return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
}
