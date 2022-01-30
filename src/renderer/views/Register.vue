<template>
  <Loader v-if="loading" />
  <section class="register-section">
    <Notification
      v-if="errors.messages.length > 0"
      :type="errors.type"
      :message="messages"
      @clear="clearNotification"
    />
    <Form @submit="handleRegister">
      <template v-slot:header>
        <Logo />
        <Separator dir="h" :size="50" colorMode="primary-ghost" />
        <h1 class="register-form__title">Welcome to 3SP</h1>
        <p class="register-form__caption">
          create a strong password to keep the keys you save safe!
        </p>
      </template>
      <template v-slot:body>
        <Input
          name="username"
          label="Username"
          :required="false"
          :error="username.error"
          type="text"
          v-model="username.value"
        />
        <PasswordInput
          :required="false"
          :error="password.error"
          v-model="password.value"
          @valid="handlePasswordValidation"
        />
      </template>
      <template v-slot:footer>
        <Button :disabled="loading" mode="primary" type="submit">
          Start!
        </Button>
        <small class="register-form__footer">
          By using this application you accept our
          <router-link class="link primary" to="#"
            >terms and conditions</router-link
          >
        </small>
      </template>
    </Form>

    <small class="version">Version: v{{ $store.getters.appVersion }}</small>
  </section>
</template>

<script>
import { computed, onMounted, reactive, ref, watch } from "vue";
import { useStore } from "vuex";

import {
  Form,
  Logo,
  Separator,
  PasswordInput,
  Button,
  Notification,
  Input,
  Loader,
} from "../components/Components";

export default {
  name: "Register",
  components: {
    Form,
    Logo,
    Separator,
    PasswordInput,
    Button,
    Notification,
    Input,
    Loader,
  },
  setup() {
    const store = useStore();
    const password = reactive({ value: "", error: null });
    const username = reactive({ value: "", error: null });
    store.dispatch("getAppVersion");

    const errors = reactive({ type: "", messages: [] });

    function setError(type, message, input) {
      if (!errors.type) errors.type = type;
      input.error = message;
      errors.messages.push(message);
    }

    const validPassword = ref(false);

    function handlePasswordValidation(isValid) {
      validPassword.value = isValid;
    }

    function handleRegister(e) {
      e.preventDefault();
      clearNotification();
      if (!validPassword.value) {
        setError("error", "Password is not strong enough!", password);
        return;
      }

      if (!password.value) {
        setError("error", "Password is required!", password);
        return;
      }
      if (!username.value) {
        setError("error", "Password is required!", username);
        return;
      }

      const validchars = /[^a-zA-Z0-9._-]/g;
      const minchar = /[a-zA-Z0-9._-]{8}/g;

      if (validchars.test(username.value)) {
        setError(
          "error",
          "Letters, numbers and '. or - or _' only allowed",
          username
        );
        return;
      }
      if (!minchar.test(username.value)) {
        setError("error", "Username must have at least 8 chars!", username);
        return;
      }

      store.dispatch("registerUser", {
        username: username.value,
        password: password.value,
      });
    }

    const error = computed(() => {
      return store.getters.errors;
    });

    watch(error, (val) => {
      if (val) {
        setError("error", val, password);
      }
    });

    const messages = computed(() => {
      return errors.messages.join("<br>");
    });

    function clearNotification() {
      errors.messages = [];
      errors.type = "";
      password.error = null;
      username.error = null;
    }

    const loading = computed(() => {
      return store.getters.loading;
    });

    onMounted(() => {
      store.commit("loaded");
    });

    return {
      password,
      username,
      errors,
      messages,
      handleRegister,
      handlePasswordValidation,
      clearNotification,
      loading,
    };
  },
};
</script>

<style lang="scss" scoped>
@import "../sass/colors", "../sass/typography";

.register-section {
  min-height: 100vh;
  width: 100%;
  padding: 5em 0;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  align-items: center;

  .register-form__title {
    font-size: $font-largest;
    font-weight: 700;
    color: $primary-dark;
  }

  .register-form__caption {
    font-size: $font-small;
    font-weight: 400;
    text-align: center;
    color: $gray;
  }

  .register-form__footer {
    font-size: $font-smaller;
    font-weight: 300;
  }

  .version {
    margin-top: 1em;
    display: block;
    color: rgb(150, 150, 150);
    font-size: 0.8em;
    font-weight: 500;
  }
}
</style>
