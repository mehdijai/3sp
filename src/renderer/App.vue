<template>
  <main class="body">
    <Loader v-if="loading" />
    <Modal v-if="updateReady">
      <template v-slot:header>
        <h1>New Update is available.</h1>
      </template>
      <template v-slot:body>
        A new update is installed, restart the app now.
      </template>
      <template v-slot:footer>
        <Button @click="confirmUpdate" mode="secondary">Update</Button>
      </template>
    </Modal>
    <router-view />
  </main>
</template>

<script>
import "material-icons/iconfont/material-icons.css";
import { ref } from "vue";
import { Loader, Modal, Button } from "./components/Components";
export default {
  name: "App",
  components: {
    Loader,
    Modal,
    Button,
  },
  setup() {
    const updateReady = ref(false);
    const loading = ref(false);

    window.ipc.on("update-ready", () => {
      updateReady.value = true;
    });

    function confirmUpdate() {
      updateReady.value = false;
      loading.value = true;
      window.ipc.send("restart-app");
    }

    return { confirmUpdate, updateReady, loading };
  },
};
</script>

<style lang="scss">
@import "./sass/colors", "./sass/typography";
@import "../../public/fonts";

* {
  box-sizing: border-box;
  font-family: "Roboto", sans-serif;
  margin: 0;
  padding: 0;
  outline: none;
}

body {
  background-color: $gray-light;
  height: 100%;
  position: relative;
}

.link {
  text-decoration: none;
  font-weight: 500;
  transition: color 0.3s ease-in;

  &.primary {
    color: $primary;

    &:hover {
      color: rgba($primary, 0.7);
    }
  }
  &.primary-ghost {
    color: $primary-light;
    &:hover {
      color: rgba($primary-light, 0.7);
    }
  }
  &.secondary {
    color: $secondary;

    &:hover {
      color: rgba($secondary, 0.7);
    }
  }
  &.secondary-ghost {
    color: $secondary-light;

    &:hover {
      color: rgba($secondary-light, 0.7);
    }
  }
}
</style>
