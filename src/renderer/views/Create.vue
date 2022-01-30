<template>
  <Menu />
  <section class="create-section">
    <Notification
      v-if="errors.messages.length > 0"
      :type="errors.type"
      :message="messages"
      @clear="clearNotification"
    />
    <Form @submit="handleCreate">
      <template v-slot:header>
        <Logo />
        <Separator dir="h" :size="50" colorMode="primary-ghost" />
        <h1 class="create-form__title">{{ pageMeta.title }}</h1>
      </template>
      <template v-slot:body>
        <Input
          name="keyName"
          label="Key Name, login email or key name"
          :error="keyname.error"
          v-model="keyname.value"
        />
        <Input
          name="description"
          label="Description (optional)"
          :error="description.error"
          v-model="description.value"
        />
        <PasswordInput
          label="The secret key"
          :error="password.error"
          v-model="password.value"
          @valid="handlePasswordValidation"
        />
      </template>
      <template v-slot:footer>
        <div class="create-form__footer">
          <small class="disclaimer"
            >The password strength is not mandatory to add the key! but it's
            recommended for more safety . Click on
            <strong>Generate a random password</strong> to generate a strong
            password for you.
          </small>
          <div class="cta">
            <Button mode="primary" type="submit"> {{ pageMeta.cta }} </Button>
            <Button mode="primary-ghost" @click="cancelForm" type="button">
              Cancel
            </Button>
          </div>
        </div>
      </template>
    </Form>
  </section>
</template>

<script>
import { computed, reactive, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useStore } from "vuex";

import {
  Form,
  Logo,
  Separator,
  Input,
  PasswordInput,
  Button,
  Notification,
  Menu,
} from "../components/Components";

export default {
  name: "Create",
  components: {
    Form,
    Logo,
    Separator,
    Input,
    PasswordInput,
    Button,
    Notification,
    Menu,
  },
  setup() {
    const router = useRouter();
    const route = useRoute();
    const store = useStore();

    const keyname = reactive({ value: "", error: null });
    const description = reactive({ value: "", error: null });
    const password = reactive({ value: "", error: null });

    const errors = reactive({ type: "", messages: [] });

    function setError(type, message, input) {
      if (!errors.type) errors.type = type;
      if (input) input.error = message;
      errors.messages.push(message);
    }

    const validPassword = ref(false);

    function handlePasswordValidation(isValid) {
      validPassword.value = isValid;
    }

    function handleCreate(e) {
      e.preventDefault();
      clearNotification();
      let valid = true;

      if (!password.value) {
        valid = false;
        setError("error", "Password is required!", password);
      }
      if (!keyname.value) {
        valid = false;
        setError("error", "Key Name is required!", keyname);
      }

      if (!validPassword.value)
        setError("warning", "Password is not strong enough!");

      if (valid) {
        let newKey = {
          name: keyname.value,
          key: password.value,
          description: description.value,
        };
        if (route.params.uuid) {
          store.dispatch("updateKey", { uuid: route.params.uuid, newKey });
        } else {
          store.dispatch("createKey", newKey);
        }
        router.push({ name: "keys-list" });
      }
    }

    const messages = computed(() => {
      return errors.messages.join("<br>");
    });

    function clearNotification() {
      errors.messages = [];
      errors.type = "";
      password.error = null;
      keyname.error = null;
      description.error = null;
    }

    function cancelForm() {
      router.push({ name: "keys-list" });
    }

    const pageMeta = reactive({ title: "", cta: "" });

    if (route.params.uuid) {
      pageMeta.title = "Update the key";
      pageMeta.cta = "Update";
      const key = store.getters.getKey(route.params.uuid);
      if (key) {
        keyname.value = key.name;
        description.value = key.description;
        password.value = key.key;
      } else {
        router.push({ path: "/not/found" });
      }
    } else {
      pageMeta.title = "Create new secret key";
      pageMeta.cta = "Create";
    }

    return {
      keyname,
      password,
      description,
      errors,
      messages,
      handleCreate,
      handlePasswordValidation,
      clearNotification,
      cancelForm,
      pageMeta,
    };
  },
};
</script>

<style lang="scss" scoped>
@import "../sass/colors", "../sass/typography";

.create-section {
  min-height: 100vh;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 2em 0;

  .create-form__title {
    font-size: $font-largest;
    font-weight: 700;
    color: $primary-dark;
  }

  .create-form__footer {
    text-align: center;
    .disclaimer {
      font-size: 0.7em;
      font-weight: 400;
      color: rgba($black, 0.8);
    }
    .cta {
      margin-top: 1.5em;
      display: flex;
      justify-content: center;
      align-items: center;
      column-gap: 1em;
    }
  }
}
</style>
