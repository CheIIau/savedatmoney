<template>
  <q-item clickable :to="props.link">
    <q-item-section v-if="props.icon" avatar>
      <q-icon :name="props.icon" />
    </q-item-section>
    <q-item-section>
      <q-item-label>{{ props.title }}</q-item-label>
    </q-item-section>
  </q-item>
</template>

<script setup lang="ts">
import { withDefaults, defineProps } from 'vue';

interface Props {
  title: string
  link: string
  icon: string
}

const props = withDefaults(defineProps<Props>(), { link: '/', icon: '/' })

</script>
