<template>
  <div>
    <div class="q-pa-md" style="max-width: 400px">
      <q-form
        ref="authForm"
        class="q-gutter-md"
        @submit="onRegister"
        @reset="onReset"
      >
        <q-input
          v-model="username"
          filled
          label="Введите ник *"
          lazy-rules
          :rules="[(val: string) => val && val.length > 3 || 'Введите ник длинее 3 символов']"
        />

        <q-input
          v-model="password"
          autocomplete="off"
          filled
          type="password"
          label="Введите пароль *"
          hint="От 6 символов"
          lazy-rules
          :rules="[
            (val: string) => val && val.length > 5 || 'Введите пароль длинее 5 символов'
          ]"
        />

        <q-toggle
          v-model="accept"
          label="Обязуюсь использовать во благо"
        />

        <div>
          <q-btn
            label="Регистрация"
            :disable="!accept"
            type="submit"
            color="primary"
          />
          <q-btn
            label="Войти"
            class="q-ml-sm"
            :disable="!accept"
            type="button"
            color="primary"
            @click="onLogin"
          />
          <q-btn
            label="Reset"
            type="reset"
            color="primary"
            flat
            class="q-ml-sm"
          />
        </div>
      </q-form>
    </div>
  </div>
</template>

<script
  setup
  lang="ts"
>
import { useQuasar, QForm } from 'quasar';
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import {
  fetchRegister,
  fetchLogin,
  requestAuthHandler,
  AuthCredentials,
  storeUserData,
} from './Auth';
const router = useRouter();
const $q = useQuasar();

const username = ref<string | null>(null);
const password = ref<string | null>(null);
const accept = ref(false);
const authForm = ref<QForm>();

async function onRegister() {
  await authForm.value?.validate().then(async (success) => {
    if (accept.value && success && username.value && password.value) {
      await requestAuthHandler(
        fetchRegister,
        username.value,
        password.value,
        $q,
      );
      await router.push('/');
    } else {
      $q.notify({
        color: 'red-5',
        textColor: 'white',
        icon: 'warning',
        message: 'Ошибка. Попробуйте еще раз',
      });
    }
  });
}

async function onLogin() {
  await authForm.value?.validate().then(async (success) => {
    if (accept.value && success && username.value && password.value) {
      const { userId, token } = (await requestAuthHandler(
        fetchLogin,
        username.value,
        password.value,
        $q,
      )) as AuthCredentials;
      storeUserData(userId, token, username.value);
      await router.push('/');
    } else {
      $q.notify({
        color: 'red-5',
        textColor: 'white',
        icon: 'warning',
        message: 'Ошибка. Попробуйте еще раз',
      });
    }
  });
}

function onReset() {
  username.value = null;
  password.value = null;
  accept.value = false;
}
</script>
