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
          class="drawer-button"
          @click="toggleLeftDrawer"
        />

        <q-toolbar-title>SaveDatMoney</q-toolbar-title>
        <header-tabs
          class="header-tabs-lg"
          :page-links="pageLinks"
        ></header-tabs>
        <div>
          <a href="https://github.com/CheIIau/savedatmoney">
            <img
              src="../assets/github-logo.svg"
              alt="github_logo"
              class="github-logo"
            >
          </a>
        </div>
      </q-toolbar>
      <header-tabs
        class="header-tabs-md"
        :page-links="pageLinks"
      ></header-tabs>
    </q-header>

    <q-drawer
      v-model="leftDrawerOpen"
      bordered
    >
      <q-list>
        <q-item-label header>SaveDatMoney</q-item-label>

        <PageLink :page-links="pageLinks" />

      </q-list>
    </q-drawer>

    <q-page-container>
      <q-page class="row justify-center q-mt-xl">
        <router-view />
      </q-page>
    </q-page-container>

    <q-btn
      class="dark-mode"
      icon="dark_mode"
      round
      glossy
      @click="toggleDarkMode"
    />

  </q-layout>
</template>

<script setup lang="ts">
import PageLink from 'src/components/PageLink.vue';
import HeaderTabs from 'src/components/HeaderTabs.vue';
import { ref, computed, onBeforeMount } from 'vue';
import { SharedGetters } from 'src/store/shared/getters';
import { useStore } from 'src/store';
import { SharedActions } from 'src/store/shared/actions';
import { SharedMutations } from 'src/store/shared/mutations';
import { useQuasar } from 'quasar';
//this.deviceWidth = window.innerWidth; but i choose to use media queries 
const $q = useQuasar();

const store = useStore();
const isUserAuth = computed(() => store.getters[SharedGetters.isUserAuth]);

const pageLinks = [
  {
    title: 'Главная страница',
    icon: 'menu_book',
    link: '/',
  },
  {
    title: 'Добавить расходы',
    icon: 'currency_ruble',
    link: '/add',
  },
  {
    title: 'Посмотреть расходы',
    icon: 'savings',
    link: '/allexpenses',
  },
];

const leftDrawerOpen = ref(false);
function toggleLeftDrawer() {
  leftDrawerOpen.value = !leftDrawerOpen.value;
}

if (!isUserAuth.value) {
  store.commit(SharedMutations.setLoadingFlag, true);
  onBeforeMount(async () => {
    await store.dispatch(SharedActions.getUserAuthentification);
    store.commit(SharedMutations.setLoadingFlag, false);
  });
}

const darkMode = localStorage.getItem('dark');
if (darkMode === 'true') {
  $q.dark.set(true);
}

function toggleDarkMode() {
  $q.dark.toggle();
  if ($q.dark.isActive) {
    localStorage.setItem('dark', 'true');
    return;
  }
  localStorage.setItem('dark', 'false');
}

</script>

<style scoped lang="scss">
.github-logo {
  max-width: 30px;
}

.header-tabs-lg {
  @media (max-width:1134px) {
    display: none;
  }
}

.header-tabs-md {
  display: none;

  @media (min-width:756px) and (max-width:1134px) {
    display: flex;
  }
}

.drawer-button {
  @media (min-width:756px) {
    display: none;
  }
}

.dark-mode {
  position: fixed;
  bottom: 15px;
  right: 15px;
}
</style>