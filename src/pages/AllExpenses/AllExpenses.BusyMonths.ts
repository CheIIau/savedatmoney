import { BusyMonthType, ObjectOfBusyMonths } from './AllExpenses';

export function createObjectOfBusyMonths(busyMonths: BusyMonthType[]) {
  const result: ObjectOfBusyMonths = {};
  busyMonths.forEach((item) => {
    result[item.year] = item.months;
  });
  return result;
}

export const monthsName = [
  'Январь',
  'Февраль',
  'Март',
  'Апрель',
  'Май',
  'Июнь',
  'Июль',
  'Август',
  'Сентябрь',
  'Октябрь',
  'Ноябрь',
  'Декабрь',
];

// export function
