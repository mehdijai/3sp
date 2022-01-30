<template>
  <Notification
    v-if="error !== null"
    :type="error.status === false ? 'error' : 'success'"
    :message="error.data"
    @clear="clearNotification"
  />
  <Loader v-if="loading" />
  <section class="import-page">
    <header class="import-page-header">
      <Menu />
      <Logo class="logo" />
    </header>
    <ImportList @close="cancelImport" v-if="open" />
    <article class="import-page-body">
      <Disclaimer class="disclaimer">
        <p class="instruction">
          Select the .3sp exported to get the encrypted passwords within.
        </p>
        <p class="note">
          Note: The password of the user who generated the files must be the
          same as the one you are using now!
        </p>
      </Disclaimer>
      <DropZone @selectFile="handleSelectFile" />
    </article>
  </section>
</template>

<script>
import { computed } from "vue";

import {
  Logo,
  Disclaimer,
  DropZone,
  Menu,
  ImportList,
  Notification,
} from "../components/Components";
import { useStore } from "vuex";
import Loader from "../components/UI/Loader.vue";

export default {
  components: {
    Disclaimer,
    Logo,
    DropZone,
    Menu,
    ImportList,
    Loader,
    Notification,
  },
  name: "Import",
  setup() {
    const store = useStore();

    const loading = computed(() => {
      return store.getters.loading;
    });

    const error = computed(() => {
      return store.getters.errors;
    });

    function clearNotification() {
      store.commit("clearError");
    }

    const open = computed(() => {
      return store.getters.imported !== null;
    });

    function handleSelectFile(filePath) {
      store.dispatch("selectImportFile", filePath);
    }

    function cancelImport() {
      store.commit("cancelImport");
    }
    return {
      open,
      cancelImport,
      handleSelectFile,
      loading,
      error,
      clearNotification,
    };
  },
};
</script>

<style lang="scss" scoped>
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
  }
}
</style>
