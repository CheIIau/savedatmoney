<template>
  <div
    class="text-center"
    active
  >
    <p>{{ title }}</p>
    <q-form
      greedy
      @submit.prevent="onSubmit"
    >
      <q-select
        v-model="category"
        :loading="loading"
        bg-color="green"
        dense
        filled
        :options="categoryList"
        label="Статьи расходов"
      >
        <template #prepend>
          <q-icon name="attach_money" />
        </template>
      </q-select>
      <q-input
        v-if="category"
        ref="quantityRef"
        v-model.number="quantity"
        :rules="quantityRules"
        type="number"
        step="0.01"
        class="q-mt-md"
        dense
        clearable
        label="Введите сумму"
      >
        <template #prepend>
          <q-icon name="currency_ruble" />
        </template>
      </q-input>
      <q-btn
        v-if="category"
        type="submit"
        class="q-mt-md"
        push
        color="primary"
        label="Push"
      >
        <template #loading>
          <q-spinner-facebook />
        </template>
      </q-btn>
    </q-form>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue';
import { QField } from 'quasar';
import getCategoriesQuery from 'src/graphql/getCategories.query.gql';
import addExpenseMutation from 'src/graphql/addExpense.mutation.gql';
import { useQuery, useMutation } from '@vue/apollo-composable';
import { quantityRules } from './AddExpense';
import { useQuasar } from 'quasar';
import getExpenses from 'src/graphql/getExpenses.query.gql';
import { AddExpenseMutationData, Expense, ExpensesOfUser } from '../AllExpenses/AllExpenses';
import { ApolloCache } from '@apollo/client/cache';

interface CategoryObject {
  categoriesLocal: Array<{ name: string }>;
  categories: Array<{ name: string }>;
}

const $q = useQuasar();
const title = 'Добавьте статью расходов и сумму';
const category = ref<null | string>(null);
const quantity = ref<number>(0);
const quantityRef = ref<QField>();
let categoryList: string[] = reactive([]);

const {
  result,
  loading,
  onResult: onResultCategoriesQuery,
  onError: onErrorCategoriesQuery,
} = useQuery(getCategoriesQuery, null, { fetchPolicy: 'cache-first' });

const username = localStorage.getItem('username');

if (result.value) {
  const categoryObject = result.value as CategoryObject;
  categoryObject.categoriesLocal.forEach(
    (
      category, //можно просто categories
    ) => categoryList.push(category.name),
  );
} //костыль, но иначе кэш не работает

onErrorCategoriesQuery((error) => {
  $q.notify({
    color: 'red-5',
    textColor: 'white',
    icon: 'warning',
    message: error.message,
  });
});


onResultCategoriesQuery((queryResult) => {
  const categoryObject = queryResult.data as CategoryObject;
  categoryObject.categories.forEach((category) =>
    categoryList.push(category.name),
  );
});

const {
  mutate: addNewExpense,
  onError: onErrorExpenseMutation,
  error,
} = useMutation(addExpenseMutation, {
  update(cache, { data: { addExpense: { expenses } } }) {
    const { expensesOfUser } = cache.readQuery({ query: getExpenses, variables: { username } }) as ExpensesOfUser;
    const arrayOfExpenses = expenses as Expense[]
    expensesOfUser[0].expenses.push(arrayOfExpenses[arrayOfExpenses.length - 1])
    console.log(expenses);
    console.log(expensesOfUser);
    // cache.writeQuery({ query: getExpenses, variables: { username }, data })
  }
});

async function onSubmit() {
  if (
    category.value &&
    quantity.value &&
    (await quantityRef.value!.validate())
  ) {

    await addNewExpense({
      username,
      quantity: quantity.value,
      category: category.value,
    });
    onErrorExpenseMutation((error) => {
      $q.notify({
        color: 'red-5',
        textColor: 'white',
        icon: 'warning',
        message: error.message,
      });
    });
    category.value = null;
    quantity.value = 0;
    if (!error.value) {
      $q.notify({
        color: 'green-4',
        textColor: 'white',
        icon: 'cloud_done',
        message: 'Добавлено',
      });
    }
  }
}
</script>

<style>
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

input[type='number'] {
  -moz-appearance: textfield;
}
</style>
