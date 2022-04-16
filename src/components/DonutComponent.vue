<template>
    <div>
        <DoughnutChart v-bind="doughnutChartProps" />
    </div>
</template>

<script setup lang="ts">

import { computed, defineProps } from 'vue';
import { DoughnutChart, useDoughnutChart } from 'vue-chart-3';
import { Chart, DoughnutController, ArcElement, Tooltip, ChartData, ChartOptions, Legend } from 'chart.js';
import autocolors from 'chartjs-plugin-autocolors';
// eslint-disable-next-line @typescript-eslint/no-unsafe-argument
Chart.register(DoughnutController, ArcElement, Tooltip, Legend, autocolors);

interface Props {
    expensesValues: number[];
    expensesLabels: string[];
}

const props = defineProps<Props>()

const testData = computed<ChartData<'doughnut'>>(() => ({
    labels: props.expensesLabels,
    datasets: [
        {
            data: props.expensesValues,
        },
    ],
}));

const options = computed<ChartOptions<'doughnut'>>(() => ({
    plugins: {
        autocolors: {
            mode: 'data'
        },
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

</script>