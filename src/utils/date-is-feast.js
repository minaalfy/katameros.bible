import { EFeast } from './feasts';
import { addDays, getEasterDate, isLeapYear } from '../utils/coptic-helpers';

const getYearFeasts = (year) => [
  {
    id: EFeast.Christmas,
    date: new Date(year, 0, 7),
  },
  {
    id: EFeast.NativityParamoun,
    date: new Date(year, 0, 6),
  },
  {
    id: EFeast.Ascension,
    date: addDays(getEasterDate(year), 39),
  },
  {
    id: EFeast.LazarusSaturday,
    date: addDays(getEasterDate(year), -8),
  },
  {
    id: EFeast.EgyptEntrance,
    date: new Date(year, 5, 1),
  },
  {
    id: EFeast.Annunciation,
    date: new Date(year, 3, 7),
  },
  {
    id: EFeast.Cross,
    date: new Date(year, 2, 19),
    date2: [new Date(year, 8, 27), new Date(year, 8, 29)],
  },
  {
    id: EFeast.Cross,
    date: new Date(year, 8, isLeapYear(year + 1) ? 27 : 28),
  },
  {
    id: EFeast.Cross,
    date: new Date(year, 8, isLeapYear(year + 1) ? 28 : 29),
  },
  {
    id: EFeast.Cross,
    date: new Date(year, 8, isLeapYear(year + 1) ? 29 : 30),
  },
  {
    id: EFeast.FastOfNinevah1,
    date: addDays(getEasterDate(year), -69),
  },
  {
    id: EFeast.FastOfNinevah2,
    date: addDays(getEasterDate(year), -68),
  },
  {
    id: EFeast.FastOfNinevah3,
    date: addDays(getEasterDate(year), -67),
  },
  {
    id: EFeast.TempleEntrance,
    date: new Date(year, 1, 15),
  },
  {
    id: EFeast.Jonas,
    date: addDays(getEasterDate(year), -66),
  },
  {
    id: EFeast.PalmSunday,
    date: addDays(getEasterDate(year), -7),
  },
  {
    id: EFeast.PaschaMonday,
    date: addDays(getEasterDate(year), -6),
  },
  {
    id: EFeast.PaschaTuesday,
    date: addDays(getEasterDate(year), -5),
  },
  {
    id: EFeast.PaschaWednesday,
    date: addDays(getEasterDate(year), -4),
  },
  {
    id: EFeast.PaschaThursday,
    date: addDays(getEasterDate(year), -3),
  },
  {
    id: EFeast.TheophanyParamoun,
    date: new Date(year, 0, 18),
  },
  {
    id: EFeast.Theophany,
    date: new Date(year, 0, 19),
  },
  {
    id: EFeast.WeddingOfCana,
    date: new Date(year, 0, 21),
  },
  {
    id: EFeast.GreatLentPreparationSaturday,
    date: addDays(getEasterDate(year), -57),
  },
  {
    id: EFeast.GreatLentPreparationSunday,
    date: addDays(getEasterDate(year), -56),
  },
  {
    id: EFeast.Easter,
    date: getEasterDate(year),
  },
  {
    id: EFeast.Nayrouz,
    date: new Date(year, 8, isLeapYear(year + 1) ? 12 : 11),
  },
];

export function dateIsFeast(date) {
  const feasts = getYearFeasts(+date.getFullYear());
  const feast = feasts.find((f) => f.date.getTime() === date.getTime());
  return feast;
}
