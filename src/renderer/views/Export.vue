<template>
  <Notification
    v-if="error !== null"
    :type="error.status === false ? 'error' : 'success'"
    :message="error.data"
    @clear="clearNotification"
  />
  <section class="import-page">
    <Loader v-if="loading" />
    <header class="import-page-header">
      <Menu />
      <Logo class="logo" />
    </header>
    <article class="import-page-body">
      <Disclaimer class="disclaimer">
        <p class="instruction">Your keys will be saved in a .3sp file.</p>
        <p class="note">
          Note: When you import the file, you should log in with the same
          password you are using now!
        </p>
      </Disclaimer>
      <div class="export-form">
        <div class="form-input">
          <Input
            width="300px"
            label="File directory"
            name="directory"
            v-model="directory"
          />
          <Button @click="selectDirectory" mode="secondary"
            >Change directory</Button
          >
        </div>
        <Button @click="exportKeys" mode="primary">Export</Button>
      </div>
    </article>
  </section>
</template>

<script>
import { computed, ref, watch } from "vue";
import { useStore } from "vuex";
import {
  Logo,
  Disclaimer,
  Menu,
  Input,
  Button,
  Loader,
  Notification,
} from "../components/Components";

export default {
  components: { Disclaimer, Logo, Menu, Input, Button, Loader, Notification },
  name: "Export",
  setup() {
    const store = useStore();
    const directory = ref(store.getters.dirPath);

    const dirPath = computed(() => {
      return store.getters.dirPath;
    });

    watch(dirPath, (to) => {
      directory.value = to;
    });

    function selectDirectory() {
      store.dispatch("selectExportDirectory");
    }

    const loading = computed(() => {
      return store.getters.loading;
    });

    const error = computed(() => {
      return store.getters.errors;
    });

    function clearNotification() {
      store.commit("clearError");
    }

    function exportKeys() {
      store.dispatch("exportKeys", directory.value);
    }

    return {
      directory,
      selectDirectory,
      loading,
      error,
      exportKeys,
      clearNotification,
    };
  },
};
</script>

<style lang="scss" scoped>
@import "../sass/colors";

.import-page {
  min-height: 100vh;
  .import-page-header {
    text-align: center;
    .logo {
      margin: 2em 0;
    }
  }
  .import-page-body {
    padding: 1em 0;
    .disclaimer {
      .instruction {
        margin-bottom: 0.5em;
      }
      .note {
        font-weight: 500;
      }
    }
    .export-form {
      margin: 0 auto;
      width: 750px;
      background: rgba($gray, 0.15);
      border-radius: 10px;
      padding: 2em 1em;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;

      .form-input {
        display: flex;
        align-items: baseline;
        column-gap: 1em;
        margin-bottom: 1em;
      }
    }
  }
}
</style>
