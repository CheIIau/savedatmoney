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
}

export interface ExpensesOfUser {
  expensesOfUser: Array<UserExpenses>;
}

export interface AddExpenseMutationData {
  data: { addExpense: ExpensesOfUser };
}
