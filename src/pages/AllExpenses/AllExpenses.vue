<template>
    <div class="q-pa-md">
        <DonutComponent
            :expenses-labels="dataLabels"
            :expenses-values="dataValues"
        />
        <q-table
            title="Расходы"
            :loading="loading"
            :rows="expenses"
            :columns="columns"
            row-key="name"
            class="my-sticky-virtscroll-table"
            :rows-per-page-options="[0]"
            virtual-scroll
            :wrap-cells=true
            :hide-pagination="true"
        />
    </div>
</template>

<script setup lang="ts">
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import DonutComponent from 'src/components/DonutComponent.vue';
import getExpenses from 'src/graphql/getExpenses.query.gql';
import { useQuery } from '@vue/apollo-composable';
import { ExpensesOfUser, Expense } from './AllExpenses';
import { ApolloQueryResult } from '@apollo/client/core';
import { Ref, ref } from 'vue';
import { formatDate } from 'src/functions';
import { QTableProps } from 'quasar'

const dataValues: Ref<number[]> = ref([30, 40, 60, 70, 5]);
const dataLabels: Ref<string[]> = ref(['Paris', 'Nîmes', 'Toulon', 'Perpignan', 'Autre']);

const username = localStorage.getItem('username');
const columns: QTableProps['columns'] = [
    { name: 'category', label: 'Категория', field: 'category', sortable: true, align: 'left' },
    { name: 'quantity', label: 'Сумма', field: 'quantity', sortable: true, align: 'left' },
    { name: 'date', label: 'Время добавления', field: 'date', sortable: true, align: 'center', format: (val: string) => formatDate(val) },
]
let expenses: Ref<undefined> | Ref<Expense[]> = ref(undefined);

const { result,
    loading,
    onResult: onResultExpensesQuery,
} = useQuery(getExpenses, { username }, { fetchPolicy: 'cache-first' }); //cache-and-network

if (result.value as ExpensesOfUser) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    expenses.value = result.value.expensesOfUser[0].expenses;
} //костыль, но иначе кэш не работает

onResultExpensesQuery((queryResult: ApolloQueryResult<ExpensesOfUser>) => {
    expenses.value = queryResult.data.expensesOfUser[0].expenses;
})

</script>

<style scoped lang="sass">

.my-sticky-virtscroll-table
    max-height: 500px

.q-table__top,
.q-table__bottom,
thead tr:first-child th
    background-color: #fff

thead tr th
    position: sticky
    z-index: 1
thead tr:last-child th
    top: 48px
thead tr:first-child th
    top: 0
</style>