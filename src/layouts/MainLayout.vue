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
        <q-item v-if="isUserAuth" clickable @click="onLogout">
          <q-item-section avatar>
            <q-icon name="logout" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Выйти из аккаунта</q-item-label>
          </q-item-section>
        </q-item>
        <q-item v-if="!isUserAuth" clickable to="/registration">
          <q-item-section avatar>
            <q-icon name="how_to_reg" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Регистрация/Вход</q-item-label>
          </q-item-section>
        </q-item>
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
import { ref, computed, onBeforeMount } from 'vue';
import { SharedGetters } from 'src/store/shared/getters';
import { useStore } from 'src/store';
import { SharedActions } from 'src/store/shared/actions';
import { SharedMutations } from 'src/store/shared/mutations';
import { useRouter } from 'vue-router';

const store = useStore();
const isUserAuth = computed(() => store.getters[SharedGetters.isUserAuth]);
const router = useRouter();
const pageLinks = [
  {
    title: 'Главная страница',
    icon: 'school',
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

async function onLogout() {
  localStorage.removeItem('token');
  localStorage.removeItem('userId');
  localStorage.removeItem('username');
  store.commit(SharedMutations.setUserAuthFlag, false);
  await router.push('/');
}
</script>
