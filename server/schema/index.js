"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Schema = void 0;
const graphql_1 = require("graphql");
const models_1 = require("../models");
const ExpenseType = new graphql_1.GraphQLObjectType({
    name: 'Expense',
    fields: () => ({
        id: {
            type: (0, graphql_1.GraphQLNonNull)(graphql_1.GraphQLID),
        },
        quantity: {
            type: (0, graphql_1.GraphQLNonNull)(graphql_1.GraphQLFloat),
        },
        category: {
            type: (0, graphql_1.GraphQLNonNull)(graphql_1.GraphQLString),
        },
        date: {
            type: (0, graphql_1.GraphQLNonNull)(graphql_1.GraphQLString),
        },
        month: {
            type: (0, graphql_1.GraphQLNonNull)(graphql_1.GraphQLInt),
        },
        year: {
            type: (0, graphql_1.GraphQLNonNull)(graphql_1.GraphQLInt),
        },
    }),
});
// const UserBusyMonthsNamesType = new GraphQLObjectType({
//   name: 'UserExpensesAtMonth',
//   fields: () => ({
//     name: {
//       type: GraphQLString,
//     },
//   }),
// });
const UserBusyMonthsType = new graphql_1.GraphQLObjectType({
    name: 'UserBusyMonths',
    fields: () => ({
        year: {
            type: (0, graphql_1.GraphQLNonNull)(graphql_1.GraphQLString),
        },
        months: {
            type: (0, graphql_1.GraphQLList)(graphql_1.GraphQLInt),
        },
    }),
});
const UserExpensesType = new graphql_1.GraphQLObjectType({
    name: 'UserExpenses',
    fields: () => ({
        username: {
            type: (0, graphql_1.GraphQLNonNull)(graphql_1.GraphQLString),
        },
        expenses: {
            type: (0, graphql_1.GraphQLList)(ExpenseType),
        },
        busyMonths: {
            type: (0, graphql_1.GraphQLList)(UserBusyMonthsType),
        },
    }),
});
const CategoryType = new graphql_1.GraphQLObjectType({
    name: 'Category',
    fields: () => ({
        id: {
            type: (0, graphql_1.GraphQLNonNull)(graphql_1.GraphQLID),
        },
        name: {
            type: (0, graphql_1.GraphQLNonNull)(graphql_1.GraphQLString),
        },
    }),
});
// defaultValue: new Date().getMonth(),
const RootQuery = new graphql_1.GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
        expensesOfUser: {
            type: new graphql_1.GraphQLList(UserExpensesType),
            args: { username: { type: graphql_1.GraphQLString } },
            resolve(_parent, args) {
                return models_1.UsersExpensesModel.find({ username: args.username });
            },
        },
        categories: {
            type: new graphql_1.GraphQLList(CategoryType),
            resolve() {
                return models_1.CategoryModel.find({});
            },
        },
        category: {
            type: new graphql_1.GraphQLList(CategoryType),
            args: { name: { type: graphql_1.GraphQLString } },
            resolve(_parent, args) {
                return models_1.CategoryModel.find({ name: args.name });
            },
        },
    },
});
const RootMutationType = new graphql_1.GraphQLObjectType({
    name: 'RootMutationType',
    fields: {
        addExpense: {
            type: UserExpensesType,
            args: {
                username: { type: graphql_1.GraphQLString },
                quantity: { type: graphql_1.GraphQLFloat },
                category: { type: graphql_1.GraphQLString },
            },
            async resolve(_parent, args) {
                let UserExpense;
                const currentMonth = new Date().getMonth();
                const currentYear = new Date().getFullYear();
                const currentDate = new Date();
                try {
                    UserExpense = await models_1.UsersExpensesModel.findOneAndUpdate({ username: args.username }, {
                        $push: {
                            expenses: {
                                quantity: args.quantity,
                                category: args.category,
                                date: currentDate,
                                month: currentMonth,
                                year: currentYear,
                            },
                        },
                    }, { upsert: true, new: true });
                    if (!UserExpense) {
                        return;
                    }
                    const aBusyMonthsItem = UserExpense.busyMonths.find((item) => item.year === currentYear);
                    if (aBusyMonthsItem) {
                        const month = aBusyMonthsItem.months.find((month) => month === currentMonth);
                        if (month === undefined) {
                            await models_1.UsersExpensesModel.findOneAndUpdate({ username: args.username, 'busyMonths.year': currentYear }, { $push: { 'busyMonths.$.months': currentMonth } });
                        }
                    }
                    else {
                        UserExpense.busyMonths.push({ year: currentYear, months: [currentMonth] });
                    }
                    await UserExpense.save();
                    return UserExpense;
                }
                catch (error) {
                    console.log(error);
                }
            },
        },
    },
});
exports.Schema = new graphql_1.GraphQLSchema({
    query: RootQuery,
    mutation: RootMutationType,
});
// const categoryList = [
//   { name: 'Супермаркеты' },
//   { name: 'ЖКХ, связь, интернет' },
//   { name: 'Автомобиль' },
//   { name: 'Одежда и аксессуары' },
//   { name: 'Здоровье и красота' },
//   { name: 'Рестораны и кафе' },
//   { name: 'Развлечения и хобби' },
//   { name: 'Онлайн маркеты' },
//   { name: 'Все для дома' },
//   { name: 'Питомцы' },
//   { name: 'Прочие расходы' },
// ];
//# sourceMappingURL=index.js.map