<template>
  <q-skeleton
    v-if="loading"
    type="circle"
    size="250px"
    class="skeleton-circle"
  />
  <SkeletonTable v-if="loading" />
</template>
<script setup lang="ts">
import SkeletonTable from 'src/components/SkeletonTable.vue';
import { defineProps } from 'vue';
interface Props {
  loading: boolean
}
defineProps<Props>();
</script>

<style>
.skeleton-circle {
  margin: 20px 40px;
}
</style>