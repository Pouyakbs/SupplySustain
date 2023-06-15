import persian from 'react-date-object/calendars/persian';
import persian_fa from 'react-date-object/locales/persian_fa';
import arabic from 'react-date-object/calendars/arabic';
import gregorian from 'react-date-object/calendars/gregorian';
import arabic_ar from 'react-date-object/locales/arabic_ar';
import gregorian_en from 'react-date-object/locales/gregorian_en';

export function renderCalendarSwitch(param) {
  switch (param) {
    case 'fa':
      return persian
      break;
    case 'en':
      return gregorian
      break;
    case 'ar':
      return arabic
      break;
  }
}
export function renderCalendarLocaleSwitch(param) {
  switch (param) {
    case 'fa':
      return persian_fa
      break;
    case 'en':
      return gregorian_en
      break;
    case 'ar':
      return arabic_ar
      break;
  }
}