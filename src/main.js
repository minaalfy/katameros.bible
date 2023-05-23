import './styles/main.css';
import Alpine from 'alpinejs';

import {
  getCopticDate,
  getGreatLentPeriod,
  getEasterDate,
  daysDiff,
  addDays,
} from './utils/coptic-helpers';
import { dateIsFeast } from './utils/date-is-feast';

window.Alpine = Alpine;

Alpine.start();
console.group();
console.info('Since you are here why not contribute to the project?');
console.info('https://github.com/minaalfy/katameros.bible');
console.groupEnd();

const env = document.querySelector('body').dataset.env;

window.getReadingsForDate = function (e) {
  let date = e ? new Date(e.target.value) : new Date();
  date.setMinutes(date.getMinutes() + date.getTimezoneOffset());

  const copticDate = getCopticDate(date);
  const [lentBeginning, lentEnding] = getGreatLentPeriod(date.getFullYear());
  const easterDate = getEasterDate(date.getFullYear());
  let easterDaysDiff = daysDiff(easterDate, date);
  let reading;
  const query = date.toISOString().split('T')[0];

  let dayFeast = dateIsFeast(date);
  const subDir = 'articles';
  if (dayFeast) {
    reading = `${subDir}/special/${dayFeast.id}.html?d=${query}`;
  } else if (
    lentBeginning.getTime() <= date.getTime() &&
    date.getTime() <= lentEnding.getTime()
  ) {
    const dayNumber = date.getDay();
    const weekNumber = Math.floor(daysDiff(lentBeginning, date) / 7) + 1;
    reading = `${subDir}/great-lent/${weekNumber}-${dayNumber}.html?d=${query}`;
  } else if (easterDaysDiff > 0 && easterDaysDiff <= 49) {
    const dayNumber = date.getDay();
    const weekNumber = Math.floor(
      easterDaysDiff / 7 + 1 - (dayNumber === 0 ? 1 : 0),
    );
    reading = `${subDir}/pentecost/${weekNumber}-${dayNumber}.html?d=${query}`;
  } else if (date.getDay() === 0) {
    let nbSunday = 0;
    let i = 0;
    while (i < copticDate.day) {
      if (addDays(date, i).getDay() === 0) nbSunday += 1;
      ++i;
    }
    reading = `${subDir}/sundays/${copticDate.month}-${nbSunday}.html?d=${query}`;
  } else {
    reading = `${subDir}/annual/${copticDate.month}-${copticDate.day}.html?d=${query}`;
  }
  if (reading) {
    location.href = reading;
  }
};
// eslint-disable-next-line compat/compat
const params = new URLSearchParams(window.location.search);
const queryDate = params.get('d');
if (queryDate) {
  const urlDate = new Date(queryDate);
  const formattedDate = document.getElementById('formattedDate');
  const gregorianDate = document.getElementById('gregorianDate');
  gregorianDate.value = queryDate;
  urlDate.setMinutes(urlDate.getMinutes() + urlDate.getTimezoneOffset());
  const arabicDate = urlDate.toLocaleDateString('ar-EG-u-nu-latn', {
    weekday: 'long',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
  formattedDate.textContent = 'الموافق: ' + arabicDate;
  formattedDate.style.maxHeight = formattedDate.scrollHeight + 'px';
}

// Check that service workers are supported
if ('serviceWorker' in navigator && env === 'production') {
  // use the window load event to keep the page load performant
  window.addEventListener('load', () => {
    try {
      navigator.serviceWorker.register('/sw.js');
    } catch (error) {
      console.error('Service worker registration failed: ', error);
    }
  });
}
