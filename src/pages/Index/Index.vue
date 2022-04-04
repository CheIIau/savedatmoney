<template>
  <div class="q-pa-md" style="max-width: 600px">
    <h6
      class="text-center"
    >Добро пожаловать на сервис по подсчету ваших расходов</h6>
    <div>
      <div v-if="!isLoading" class="main-content">
        <router-link
          v-if="!isUserAuth"
          v-slot="{ navigate }"
          custom
          to="/registration"
        >
          <q-btn
            role="link"
            @click="navigate"
          >Зарегистируйтесь или войдите</q-btn>
        </router-link>
        <router-link v-else v-slot="{ navigate }" to="/add" custom>
          <q-btn class="q-mr-md" role="link" @click="navigate">Нажмите</q-btn>
          <p
            class="text-center"
          >Чтобы добавить или посмотреть ваши расходы</p>
        </router-link>
      </div>
      <q-inner-loading
        :showing="isLoading"
        label="Подождите..."
        label-class="text-teal"
        label-style="font-size: 1.1em"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { onBeforeMount, computed } from 'vue';
import { SharedGetters } from '../../store/shared/getters';
import { useStore } from '../../store';
import { SharedActions } from 'src/store/shared/actions';
import { SharedMutations } from 'src/store/shared/mutations';

const store = useStore();
const isUserAuth = computed(() => store.getters[SharedGetters.isUserAuth]);
const isLoading = computed(() => store.getters[SharedGetters.isLoading]);

if (!isUserAuth.value) {
  store.commit(SharedMutations.setLoadingFlag, true);
  onBeforeMount(async () => {
    await store.dispatch(SharedActions.getUserAuthentification);
    store.commit(SharedMutations.setLoadingFlag, false);
  });
}

</script>

<style>
.main-content {
  display: flex;
  flex-wrap: wrap;
  align-content: center;
  justify-content: center;
  align-items: baseline;
}
</style>
