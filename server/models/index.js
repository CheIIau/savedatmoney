"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserDataModel = exports.CategoryModel = exports.UsersExpensesModel = void 0;
const mongoose_1 = require("mongoose");
const expenseSchema = new mongoose_1.Schema({
    quantity: { type: Number, required: true },
    category: { type: String, required: true },
    date: { type: String, default: String(new Date()) },
    month: { type: Number, default: new Date().getMonth(), required: true },
    year: { type: Number, default: new Date().getFullYear(), required: true },
});
const userBusyMonthsSchema = new mongoose_1.Schema({
    year: { type: Number, required: true, unique: true },
    months: [{ type: Number, required: true, unique: true }],
});
const usersExpensesSchema = new mongoose_1.Schema({
    username: { type: String, required: true },
    expenses: [expenseSchema],
    busyMonths: [userBusyMonthsSchema],
});
const categorySchema = new mongoose_1.Schema({
    name: { type: String },
});
const userDataSchema = new mongoose_1.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
});
exports.UsersExpensesModel = (0, mongoose_1.model)('UserExpensesList', usersExpensesSchema);
exports.CategoryModel = (0, mongoose_1.model)('Category', categorySchema);
exports.UserDataModel = (0, mongoose_1.model)('User', userDataSchema);
//# sourceMappingURL=index.js.map