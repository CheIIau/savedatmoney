import {
  GraphQLObjectType,
  GraphQLString,
  GraphQLSchema,
  GraphQLID,
  GraphQLFloat,
  GraphQLList,
  GraphQLInt,
  GraphQLNonNull,
} from 'graphql';
import { UsersExpensesModel, CategoryModel } from '../models';

const ExpenseType = new GraphQLObjectType({
  name: 'Expense',
  fields: () => ({
    id: {
      type: GraphQLNonNull(GraphQLID),
    },
    quantity: {
      type: GraphQLNonNull(GraphQLFloat),
    },
    category: {
      type: GraphQLNonNull(GraphQLString),
    },
    date: {
      type: GraphQLNonNull(GraphQLString),
    },
    month: {
      type: GraphQLNonNull(GraphQLInt),
    },
    year: {
      type: GraphQLNonNull(GraphQLInt),
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

const UserBusyMonthsType = new GraphQLObjectType({
  name: 'UserBusyMonths',
  fields: () => ({
    year: {
      type: GraphQLNonNull(GraphQLString),
    },
    months: {
      type: GraphQLList(GraphQLInt),
    },
  }),
});

const UserExpensesType = new GraphQLObjectType({
  name: 'UserExpenses',
  fields: () => ({
    username: {
      type: GraphQLNonNull(GraphQLString),
    },
    expenses: {
      type: GraphQLList(ExpenseType),
    },
    busyMonths: {
      type: GraphQLList(UserBusyMonthsType),
    },
  }),
});

const CategoryType = new GraphQLObjectType({
  name: 'Category',
  fields: () => ({
    id: {
      type: GraphQLNonNull(GraphQLID),
    },
    name: {
      type: GraphQLNonNull(GraphQLString),
    },
  }),
});
// defaultValue: new Date().getMonth(),

const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
    expensesOfUser: {
      type: new GraphQLList(UserExpensesType),
      args: { username: { type: GraphQLString } },
      resolve(_parent, args) {
        return UsersExpensesModel.find({ username: args.username as string });
      },
    },
    categories: {
      type: new GraphQLList(CategoryType),
      resolve() {
        return CategoryModel.find({});
      },
    },
    category: {
      type: new GraphQLList(CategoryType), // or just CategoryType
      args: { name: { type: GraphQLString } },
      resolve(_parent, args) {
        return CategoryModel.find({ name: args.name as string });
      },
    },
  },
});

const RootMutationType = new GraphQLObjectType({
  name: 'RootMutationType',
  fields: {
    addExpense: {
      type: UserExpensesType,
      args: {
        username: { type: GraphQLString },
        quantity: { type: GraphQLFloat },
        category: { type: GraphQLString },
      },
      async resolve(_parent, args) {
        let UserExpense;
        const currentMonth = new Date().getMonth();
        const currentYear = new Date().getFullYear();
        const currentDate = new Date();
        try {
          UserExpense = await UsersExpensesModel.findOneAndUpdate(
            { username: args.username as string },
            {
              $push: {
                expenses: {
                  quantity: args.quantity as number,
                  category: args.category as string,
                  date: currentDate,
                  month: currentMonth,
                  year: currentYear,
                },
              },
            },
            { upsert: true, new: true },
          );
          if (!UserExpense) {
            return;
          }
          const aBusyMonthsItem = UserExpense.busyMonths.find((item) => item.year === currentYear);
          if (aBusyMonthsItem) {
            const month = aBusyMonthsItem.months.find((month) => month === currentMonth);
            if (month === undefined) {
              await UsersExpensesModel.findOneAndUpdate(
                { username: args.username as string, 'busyMonths.year': currentYear },
                { $push: { 'busyMonths.$.months': currentMonth } },
              );
            }
          } else {
            UserExpense.busyMonths.push({ year: currentYear, months: [currentMonth] });
          }
          await UserExpense.save();
          return UserExpense;
        } catch (error) {
          console.log(error);
        }
      },
    },
  },
});

export const Schema = new GraphQLSchema({
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
