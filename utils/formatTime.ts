import {
  format,
  getTime,
  formatDistanceToNow,
  formatDuration,
  intervalToDuration,
  FormatDurationOptions,
} from 'date-fns';
import { th } from 'date-fns/locale';

type InputValue = Date | string | number | null;

export function fDate(date: InputValue, newFormat?: string) {
  const fm = newFormat || 'dd MMM yyyy';

  return date ? format(new Date(date), fm, { locale: th }) : '';
}

export function fDateTime(date: InputValue, newFormat?: string) {
  const fm = newFormat || 'dd MMM yyyy p';

  return date ? format(new Date(date), fm, { locale: th }) : '';
}

export function fTimestamp(date: InputValue) {
  return date ? getTime(new Date(date)) : '';
}

export function fToNow(date: InputValue) {
  return date ? formatDistanceToNow(new Date(date), { addSuffix: true, locale: th }) : '';
}

export function fSecondsToDuration(seconds: number, option?: FormatDurationOptions) {
  const miliseconds = seconds * 1000;
  const duration = intervalToDuration({ start: 0, end: miliseconds });
  return duration ? formatDuration(duration, { locale: th, ...option }) : '';
}
