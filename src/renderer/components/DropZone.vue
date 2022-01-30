<template>
  <div class="container">
    <div
      @drop="fileDropped"
      @dragenter="activeZone = true"
      @dragleave="activeZone = false"
      @dragover.prevent
      class="dropzone"
      :class="activeZone ? 'active' : ''"
    >
      <h2 class="title">{{ title }}</h2>
      <span v-if="activeZone" class="icon material-icons"
        >arrow_circle_down</span
      >
      <Button v-else @click="selectFile" mode="primary-ghost"
        >Or click to choose the file</Button
      >
    </div>
  </div>
</template>

<script>
import { computed, ref } from "vue";
import Button from "./UI/Button.vue";
export default {
  components: { Button },
  name: "DropZone",
  emits: ["selectFile"],
  setup(_, ctx) {
    const activeZone = ref(false);
    const title = computed(() => {
      return activeZone.value === true
        ? "Release the file here"
        : "Drag and drop the .3sp file here";
    });
    function selectFile(e) {
      e.stopPropagation();
      ctx.emit("selectFile", null);
    }

    function fileDropped(e) {
      activeZone.value = false;
      ctx.emit("selectFile", e.dataTransfer.files[0].path);
    }

    return { title, activeZone, selectFile, fileDropped };
  },
};
</script>

<style lang="scss" scoped>
@import "../sass/colors", "../sass/typography";

.container {
  width: 100%;
  .dropzone {
    margin: 0 auto;
    width: 750px;
    height: 300px;
    background: $white;
    border-radius: 10px;
    border: 2px dashed rgba($secondary, 0.5);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    position: relative;
    overflow: hidden;
    transition: 0.5s ease;

    .title {
      margin-bottom: 0.2em;
      color: $primary-dark;
      transition: 0.5s ease;
    }

    .icon {
      font-size: 2.5em;
      margin-top: 0.5em;
      color: $white;
      animation: icon__animation 1s ease-in-out alternate-reverse infinite;
    }

    &.active {
      background: $secondary;
      border-color: $white;
      .title {
        color: $white;
      }
    }
  }
}

@keyframes icon__animation {
  from {
    transform: translateY(0);
    opacity: 1;
  }
  to {
    transform: translateY(-10px);
    opacity: 0.8;
  }
}
</style>
