import { QTableProps } from 'quasar';
import { formatDate } from 'src/functions';

export interface Expense {
  quantity: number;
  category: string;
  date: string;
  month: number;
  year: number;
}

export interface BusyMonthType {
  year: string;
  months: number[];
}

export interface UserExpenses {
  username: string;
  expenses: Array<Expense>;
  busyMonths: BusyMonthType[];
}

export interface ExpensesOfUser {
  expensesOfUser: Array<UserExpenses>;
}

export interface AddExpenseMutationData {
  data: { addExpense: ExpensesOfUser };
}

export interface ObjectOfBusyMonths {
  [key: string]: number[];
}

export function getQuantitiesPerEachCategory(
  expenses: Expense[],
  listOfCategories: string[],
) {
  const listOfExpenses: number[] = new Array(listOfCategories.length).fill(
    0,
  ) as [];
  for (let i = 0; i < listOfCategories.length; i++) {
    expenses.forEach((item) => {
      if (item.category === listOfCategories[i]) {
        listOfExpenses[i] += item.quantity;
      }
    });
  }
  return listOfExpenses;
}

export const columns: QTableProps['columns'] = [
  {
    name: 'category',
    label: 'Категория',
    field: 'category',
    sortable: true,
    align: 'left',
  },
  {
    name: 'quantity',
    label: 'Сумма',
    field: 'quantity',
    sortable: true,
    align: 'left',
  },
  {
    name: 'date',
    label: 'Время добавления',
    field: 'date',
    sortable: true,
    align: 'center',
    format: (val: string) => formatDate(val),
  },
];
