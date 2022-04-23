<template>
  <div class="doughnut-container">
    <div
      class="arrow arrow-left"
      title="Previous"
      @click="emit('leftArrowClick')"
    ></div>
    <div class="doughnut-container__addittional">
      <p class="doughnut-container__month-label">{{ monthsName[currentMonth] }} {{ currentYear }}
        года
      </p>
      <p
        v-if="expensesValues.length === 0"
        class="doughnut-container__label"
      >В этом мясяце у вас нет расходов :(</p>
      <DoughnutChart v-bind="doughnutChartProps" />
    </div>
    <div
      class="arrow arrow-right"
      :style="rightArrowStyle"
      title="Next"
      @click="$emit('rightArrowClick')"
    ></div>
  </div>
</template>

<script setup lang="ts">

import { computed, defineProps, defineEmits } from 'vue';
import { DoughnutChart, useDoughnutChart } from 'vue-chart-3';
import { Chart, DoughnutController, ArcElement, Tooltip, ChartData, ChartOptions, Legend } from 'chart.js';
import { ObjectOfBusyMonths } from 'src/pages/AllExpenses/AllExpenses';
import { monthsName } from 'src/pages/AllExpenses/AllExpenses.BusyMonths';
Chart.register(DoughnutController, ArcElement, Tooltip, Legend);
// import getBusyMonths from 'src/graphql/getBusyMonths.query.gql'
// import { useQuery } from '@vue/apollo-composable';
// const username = localStorage.getItem('username');
const emit = defineEmits<{
  (e: 'leftArrowClick'): void;
  (e: 'rightArrowClick'): void;
}>()

interface Props {
  expensesValues: number[];
  expensesLabels: string[];
  currentYear: number;
  currentMonth: number;
  objectOfBusyMonths: ObjectOfBusyMonths;
}

const rightArrowStyle = computed(() => {
  if (props.currentYear in props.objectOfBusyMonths) {
    const maxMonthInArr = Math.max(...props.objectOfBusyMonths[props.currentYear]);
    if (maxMonthInArr == props.currentMonth) {
      return { display: 'none' }
    }
  }
  return { display: 'inherit' }
})

const props = defineProps<Props>()

const testData = computed<ChartData<'doughnut'>>(() => ({
  labels: props.expensesLabels,
  datasets: [
    {
      data: props.expensesValues,
      backgroundColor: getArrayOfChartColors(props.expensesLabels.length)
    },

  ],
}));

const options = computed<ChartOptions<'doughnut'>>(() => ({
  plugins: {
    legend: {
      position: 'bottom',
    },
    title: {
      display: true,
      text: 'Chart.js Doughnut Chart',
    },
  },
}));

const { doughnutChartProps } = useDoughnutChart({
  chartData: testData,
  options
});

function getArrayOfChartColors(length: number) {
  const arrayOfColors: string[] = [];
  function randomNumber() {
    return Math.ceil(Math.random() * (255 - 50) + 50);
  }
  for (let i = 0; i <= length; i++) {
    const red = randomNumber();
    const green = randomNumber();
    const blue = randomNumber();
    arrayOfColors.push(`rgb(${red}, ${green}, ${blue})`);
  }
  return arrayOfColors;
}

</script>

<style lang="scss">
@import './DonutComponent.scss';
</style>
