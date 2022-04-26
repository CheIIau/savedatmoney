<template>
  <q-tabs
    shrink
    stretch
    align="center"
    inline-label
  >
    <q-route-tab
      v-for="link in props.pageLinks"
      :key="link.title"
      :to="link.link"
      :label="link.title"
      :icon="link.icon"
    />
    <q-tab
      v-if="isUserAuth"
      label="Выйти из аккаунта"
      icon="logout"
      @click="onLogout"
    />
    <q-route-tab
      v-else
      label="Регистрация/Вход"
      icon="how_to_reg"
      to="/registration"
    />
  </q-tabs>
</template>

<script setup lang="ts">
import { computed, defineProps } from 'vue';
import { SharedGetters } from 'src/store/shared/getters';
import { useStore } from 'src/store';
import { useRouter } from 'vue-router';
import { SharedMutations } from 'src/store/shared/mutations';

const router = useRouter();
const store = useStore();
const isUserAuth = computed(() => store.getters[SharedGetters.isUserAuth]);
async function onLogout() {
  localStorage.removeItem('token');
  localStorage.removeItem('userId');
  localStorage.removeItem('username');
  store.commit(SharedMutations.setUserAuthFlag, false);
  await router.push('/');
}

const props = defineProps<Props>();

interface links {
  title: string;
  link: string;
  icon: string;
}
interface Props {
  pageLinks: links[];
}
</script>