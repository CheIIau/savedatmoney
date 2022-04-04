export interface Expense {
  quantity: number;
  category: string;
  date: string;
  month: number;
  year: number;
}

export interface UserExpenses {
  username: string;
  expenses: Array<Expense>;
  busyMonths: Array<UserBusyMonths>;
}

export interface Category {
  name: string;
}

export interface UserData {
  username: string;
  password: string;
}

export interface UserBusyMonths {
  year: number;
  months: Array<number>;
  _id?: number;
}
