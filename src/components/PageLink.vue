<template>
  <q-item
    v-for="link in props.pageLinks"
    :key="link.title"
    clickable
    :to="link.link"
    :exact="true"
  >
    <q-item-section
      v-if="link.icon"
      avatar
    >
      <q-icon :name="link.icon" />
    </q-item-section>
    <q-item-section>
      <q-item-label>{{ link.title }}</q-item-label>
    </q-item-section>
  </q-item>

  <q-item
    v-if="isUserAuth"
    clickable
    @click="onLogout"
  >
    <q-item-section avatar>
      <q-icon name="logout" />
    </q-item-section>
    <q-item-section>
      <q-item-label>Выйти из аккаунта</q-item-label>
    </q-item-section>
  </q-item>

  <q-item
    v-if="!isUserAuth"
    clickable
    to="/registration"
  >
    <q-item-section avatar>
      <q-icon name="how_to_reg" />
    </q-item-section>
    <q-item-section>
      <q-item-label>Регистрация/Вход</q-item-label>
    </q-item-section>
  </q-item>
</template>

<script setup lang="ts">
import { defineProps, computed } from 'vue';
import { SharedGetters } from 'src/store/shared/getters';
import { useRouter } from 'vue-router';
import { useStore } from 'src/store';
import { SharedMutations } from 'src/store/shared/mutations';

const router = useRouter();
const store = useStore();
async function onLogout() {
  localStorage.removeItem('token');
  localStorage.removeItem('userId');
  localStorage.removeItem('username');
  store.commit(SharedMutations.setUserAuthFlag, false);
  await router.push('/');
}

const isUserAuth = computed(() => store.getters[SharedGetters.isUserAuth]);

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
