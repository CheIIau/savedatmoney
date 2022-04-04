import { Schema, model } from 'mongoose';
import { Expense, UserExpenses, Category, UserData, UserBusyMonths } from './types';

const expenseSchema = new Schema<Expense>({
  quantity: { type: Number, required: true },
  category: { type: String, required: true },
  date: { type: String, default: String(new Date()) },
  month: { type: Number, default: new Date().getMonth(), required: true },
  year: { type: Number, default: new Date().getFullYear(), required: true },
});

const userBusyMonthsSchema = new Schema<UserBusyMonths>({
  year: { type: Number, required: true, unique: true },
  months: [{ type: Number, required: true, unique: true }],
});

const usersExpensesSchema = new Schema<UserExpenses>({
  username: { type: String, required: true },
  expenses: [expenseSchema],
  busyMonths: [userBusyMonthsSchema],
});

const categorySchema = new Schema<Category>({
  name: { type: String },
});

const userDataSchema = new Schema<UserData>({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

export const UsersExpensesModel = model<UserExpenses>('UserExpensesList', usersExpensesSchema);
export const CategoryModel = model<Category>('Category', categorySchema);
export const UserDataModel = model<UserData>('User', userDataSchema);
