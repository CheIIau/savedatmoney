
<template>
  <div class="text-center" active>
    <p>{{ title }}</p>
    <q-form greedy @submit.prevent="onSubmit">
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
import getCategoriesQuery from '../graphql/getCategories.query.gql';
import addExpenseMutation from '../graphql/addExpense.mutation.gql';
import { useQuery, useMutation } from '@vue/apollo-composable';

interface CategoryObject {
  categories: Array<{ name: string }>
}

const title = 'Добавьте статью расходов и сумму';
const category = ref<null | string>(null);
const quantity = ref<number>(0);
const quantityRef = ref<QField>();
const categoryList: string[] = reactive([]);

const { loading, error, onResult } = useQuery(getCategoriesQuery);
if (error.value) {
  console.log(error.value);
}

onResult(queryResult => {
  const categoryObject = queryResult.data as CategoryObject
  categoryObject.categories.forEach(category => categoryList.push(category.name))
})

const quantityRules = [
  (val: number) => typeof val === 'number' || 'Пожайлуйста, введите число',
  (val: number) => {
    if (val.toString().includes('.')) {
      return (val && val.toString().split('.').pop()!.length <= 2) || 'Должно быть 2 цифры после запятой';
    }
    return true;
  },
];

const username = localStorage.getItem('username');
const quan = 20000
const cate = 'asd'

const { mutate: addNewExpense, error: onError } = useMutation(addExpenseMutation);

console.log(username, quan, cate);

console.log(onError.value);
console.log(123);
async function onSubmit() {
  if (category.value && quantity.value && (await quantityRef.value!.validate())) {
    await addNewExpense({ username: username, quantity: quan, category: cate })
    // if (mutateError.value) {
    //   console.log(mutateError.value);
    //   console.log('bad');
    //   return;
    // }
    console.log('good');
  }
}
</script>

<style>
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

input[type="number"] {
  -moz-appearance: textfield;
}
</style>

<!-- interface Props {
  title: string;
}

const props = defineProps<Props>(); -->
