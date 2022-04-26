<template>
  <main class="q-page row justify-center expenses-container">
    <skeleton-expenses :loading="loading" />
    <DonutComponent
      v-if="!loading && expenses?.length"
      class="q-pa-md"
      :expenses-labels="listOfCategories"
      :expenses-values="listOfQuantities"
      :current-year="currentYear"
      :current-month="currentMonth"
      :object-of-busy-months="objectOfBusyMonths"
      @left-arrow-click="loadPreviousMonthExpenses"
      @right-arrow-click="loadNextMonthExpenses"
    />
    <q-table
      v-if="!loading && filteredArrayOfExpenses?.length"
      title="Расходы"
      :loading="loading"
      :rows="filteredArrayOfExpenses"
      :columns="columns"
      row-key="name"
      class="my-sticky-virtscroll-table expenses-container__table q-pa-md"
      :rows-per-page-options="[0]"
      virtual-scroll
      :wrap-cells="true"
      :hide-pagination="true"
    />
  </main>

  <p
    v-if="!loading && !expenses.length"
    class="text-h4 zero-expenses text-center"
  >
    У вас пока нет расходов<br />
    :(
  </p>
</template>

<script setup lang="ts">
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import DonutComponent from 'src/components/DonutComponent/DonutComponent.vue';
import SkeletonExpenses from 'src/components/SkeletonExpenses.vue';
import getExpenses from 'src/graphql/getExpenses.query.gql';
import { useQuery } from '@vue/apollo-composable';
import {
  ExpensesOfUser,
  Expense,
  getQuantitiesPerEachCategory,
  ObjectOfBusyMonths,
  UserExpenses,
  columns
} from './AllExpenses';
import { ApolloQueryResult } from '@apollo/client/core';
import { Ref, ref, computed } from 'vue';
import { createObjectOfBusyMonths } from './AllExpenses.BusyMonths';
let loading: Ref<boolean> = ref(false);

const listOfCategories = computed(() => {
  if (filteredArrayOfExpenses.value.length !== 0) {
    return [
      ...new Set(filteredArrayOfExpenses.value.map((item) => item.category)),
    ];
  }
  return [];
});
const listOfQuantities = computed(() => {
  if (filteredArrayOfExpenses.value.length !== 0) {
    return getQuantitiesPerEachCategory(
      filteredArrayOfExpenses.value,
      listOfCategories.value,
    );
  }
  return [];
});
const objectOfBusyMonths: Ref<ObjectOfBusyMonths> = ref({});

const currentMonth = ref(new Date().getMonth());
const currentYear = ref(new Date().getFullYear());
let expenses: Ref<Expense[]> = ref([]);
const username = localStorage.getItem('username');

const filteredArrayOfExpenses = computed(() => {
  const arr = expenses.value.filter((item) => {
    return item.year === currentYear.value && item.month === currentMonth.value;
  });
  if (arr.length === 0) return [];
  return arr;
});



if (username) {
  const {
    result,
    loading: loadingResult,
    onResult: onResultExpensesQuery,
  } = useQuery(getExpenses, { username }, { fetchPolicy: 'cache-first' });
  loading = loadingResult

  if (result.value?.expensesOfUser[0] as UserExpenses) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    expenses.value = result.value.expensesOfUser[0]?.expenses;
    objectOfBusyMonths.value = createObjectOfBusyMonths(
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      result.value.expensesOfUser[0].busyMonths,
    );
  } //костыль, но иначе кэш не работает

  onResultExpensesQuery((queryResult: ApolloQueryResult<ExpensesOfUser>) => {
    if (queryResult.data?.expensesOfUser?.length !== 0) {
      expenses.value = queryResult.data?.expensesOfUser[0]?.expenses;
      if (expenses.value) {
        objectOfBusyMonths.value = createObjectOfBusyMonths(
          queryResult.data.expensesOfUser[0].busyMonths,
        );
      }

    }
  });
}


function loadPreviousMonthExpenses() {
  if (currentMonth.value === 0) {
    currentYear.value -= 1;
    currentMonth.value = 11;
    return;
  }
  currentMonth.value -= 1;
}
function loadNextMonthExpenses() {
  if (
    currentMonth.value === 11 &&
    currentYear.value !== new Date().getFullYear()
  ) {
    currentYear.value += 1;
    currentMonth.value = 0;
    return;
  }
  currentMonth.value += 1;
}
</script>

<style scoped lang="scss">
@import './AllExpenses.scss';
</style>
