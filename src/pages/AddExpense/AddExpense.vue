<template>
  <div
    class="text-center"
    active
  >
    <p v-if="!category">Добавьте статью расходов и сумму</p>
    <div v-else>
      <q-btn
        align="right"
        class="btn-fixed-width q-mb-lg"
        color="secondary"
        label="Выбрать другую категорию"
        icon="arrow_back"
        @click="category = null"
      />
      <p class="category-name">Категория: {{ category }}</p>
    </div>

    <q-form
      class="add-expense-form"
      greedy
      @submit.prevent="onSubmit"
    >
      <div
        v-if="!category"
        class="add-expense-form__category-buttons"
      >
        <div
          v-for="icon, i in categoryIcons"
          :key="icon.name"
          class="add-expense-form__category-buttons__button"
        >
          <label>{{ categoryList[i] }}</label>
          <q-btn
            outline
            fab
            :loading="loading"
            :color="icon.color"
            :icon="icon.name"
            @click="category = categoryList[i]"
          />
        </div>
      </div>
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
        label="Добавить"
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
import { quantityRules, categoryIcons } from './AddExpense';
import { useQuasar } from 'quasar';
import getExpenses from 'src/graphql/getExpenses.query.gql';
import { Expense, ExpensesOfUser } from '../AllExpenses/AllExpenses';

interface CategoryObject {
  categoriesLocal: Array<{ name: string }>;
  categories: Array<{ name: string }>;
}

const $q = useQuasar();
const category = ref<null | string>(null);
const quantity = ref<number>();
const quantityRef = ref<QField>();
let categoryList: string[] = reactive([]);

const {
  loading,
  onResult: onResultCategoriesQuery,
  onError: onErrorCategoriesQuery,
} = useQuery(getCategoriesQuery, null, { fetchPolicy: 'cache-first' });

const username = localStorage.getItem('username');

// if (result.value) {
//   const categoryObject = result.value as CategoryObject;
//   categoryObject.categoriesLocal.forEach( //можно просто categories
//     (
//       category,
//     ) => categoryList.push(category.name),
//   );
// }

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
    const expensesData = cache.readQuery({ query: getExpenses, variables: { username } }) as ExpensesOfUser;
    if (expensesData) {
      const arrayOfExpenses = expenses as Expense[];
      // const updatedExpensesOfUser = JSON.parse(JSON.stringify(expensesOfUser)) as UserExpenses[]
      // updatedExpensesOfUser[0].expenses.push(arrayOfExpenses[arrayOfExpenses.length - 1]);
      // console.log(expensesOfUser);
      // console.log(arrayOfExpenses);
      cache.writeQuery({
        query: getExpenses, variables: { username }, data: {
          ...expensesData,
          expensesOfUser: {
            '0': {
              username,
              expenses: [...arrayOfExpenses],
            }
          }
        }
      })
    }
  }
}
);

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

<style lang="scss">
.category-name {
  font-size: 16px;
}

.add-expense-form {
  max-width: 400px;

  &__category-buttons {
    @media (max-width: 500px) {
      grid-template-columns: repeat(6, 1fr);
    }

    display: grid;
    grid-template-columns: repeat(8, 1fr);

    &__button {
      display: flex;
      flex-direction: column;
      flex-wrap: nowrap;
      align-items: center;
      justify-content: space-around;
      margin: 5px 10px;
      grid-column: span 2;

      @media (min-width: 501px) {
        &:last-child:nth-child(4n - 1) {
          grid-column-end: -2;
        }

        &:nth-last-child(2):nth-child(4n + 1) {
          grid-column-end: 4;
        }

        &:nth-last-child(3):nth-child(4n + 1) {
          grid-column-end: 4;
        }
      }


      @media (max-width: 500px) {
        margin: 0 10px;

        &:last-child:nth-child(3n - 1) {
          grid-column-end: -2;
        }

        &:nth-last-child(2):nth-child(3n + 1) {
          grid-column-end: 4;
        }
      }
    }
  }
}


input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

input[type='number'] {
  -moz-appearance: textfield;
}
</style>


      <!-- <q-select
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
      </q-select> -->