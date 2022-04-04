<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="toggleLeftDrawer"
        />

        <q-toolbar-title>SaveDatMoney</q-toolbar-title>

        <div>Здесь будет ссылка на гитхаб</div>
      </q-toolbar>
    </q-header>

    <q-drawer v-model="leftDrawerOpen" bordered>
      <q-list>
        <q-item-label header>SaveDatMoney</q-item-label>

        <PageLink
          v-for="link in pageLinks"
          :key="link.title"
          v-bind="link"
        />
      </q-list>
    </q-drawer>

    <q-page-container>
      <q-page class="row justify-center q-mt-xl">
        <router-view />
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import PageLink from 'src/components/PageLink.vue';
import { ref } from 'vue';

const pageLinks = [
  {
    title: 'Главная страница',
    icon: 'school',
    link: '/',
  },
  {
    title: 'Регистрация',
    icon: 'how_to_reg',
    link: '/registration',
  },
  {
    title: 'Добавить расходы',
    icon: 'currency_ruble',
    link: '/add',
  },
];
const leftDrawerOpen = ref(false);
function toggleLeftDrawer() {
  leftDrawerOpen.value = !leftDrawerOpen.value;
}
</script>
