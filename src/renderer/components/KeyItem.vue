<template>
  <Modal v-if="toDelete === keyItem.uuid">
    <template v-slot:header>
      <h1>Are you sure you want to delete “{{ keyItem.name }}” key?</h1>
    </template>
    <template v-slot:body>
      Be carefully! If you delete this item you won’t be able to recover it!
    </template>
    <template v-slot:footer>
      <Button @click="confirmDelete" mode="secondary">Delete</Button>
      <Button @click="cancelDelete" mode="primary-ghost">Cancel</Button>
    </template>
  </Modal>
  <div class="keyItem">
    <div class="meta">
      <div class="info">
        <span class="name"
          ><strong>{{ keyItem.name }}</strong>
        </span>
        <span class="description">{{
          keyItem.description || "no description is set!"
        }}</span>
      </div>
      <div class="actions">
        <span @click="hideKey" class="icon warning material-icons" v-if="show"
          >visibility_off</span
        >
        <span @click="showKey" v-else class="icon success material-icons"
          >visibility</span
        >
        <span @click="handleEdit" class="icon info material-icons">edit</span>
        <span @click="handleDelete" class="icon error material-icons"
          >delete</span
        >
      </div>
    </div>
    <div v-if="show" ref="keyVal" class="key">
      <span class="value">{{ keyItem.key }}</span>
      <div @click="copy" class="copy">
        <span class="icon material-icons">content_copy</span>
        <div ref="tooltip" v-if="copied" class="tooltip">
          <span class="text"> Copied! </span>
          <span class="arrow"></span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, watch } from "vue";
import { Modal, Button } from "./Components";
import { useRouter } from "vue-router";
import { useStore } from "vuex";

export default {
  name: "KeyItem",
  components: {
    Modal,
    Button,
  },
  props: {
    keyItem: Object,
    displayed: String,
  },
  emits: ["show"],
  setup(props, context) {
    const store = useStore();
    const router = useRouter();

    const keyVal = ref(null);

    function showKey() {
      context.emit("show", props.keyItem.uuid);
    }
    function hideKey() {
      keyVal.value.classList.add("closing");
      setTimeout(() => {
        context.emit("show", null);
      }, 800);
    }

    const show = computed(() => {
      return props.displayed === props.keyItem.uuid;
    });

    const toDelete = ref(null);

    function handleDelete() {
      toDelete.value = props.keyItem.uuid;
    }

    function confirmDelete() {
      store.dispatch("deleteKey", props.keyItem.uuid);
      toDelete.value = null;
    }
    function cancelDelete() {
      toDelete.value = null;
    }

    const copied = ref(false);
    const tooltip = ref(null);

    function copy() {
      navigator.clipboard.writeText(props.keyItem.key);
      copied.value = true;
    }

    watch(tooltip, (element) => {
      if (element) {
        let text = element.querySelector(".text");
        let arrow = element.querySelector(".arrow");

        setTimeout(() => {
          text.classList.add("tooltip-text__closing");
          arrow.classList.add("tooltip-arrow__closing");
        }, 2000);

        setTimeout(() => {
          copied.value = false;
        }, 2200);
      }
    });

    function handleEdit() {
      router.push({ name: "edit", params: { uuid: props.keyItem.uuid } });
    }

    return {
      show,
      showKey,
      hideKey,
      handleDelete,
      toDelete,
      confirmDelete,
      cancelDelete,
      copy,
      copied,
      tooltip,
      keyVal,
      handleEdit,
    };
  },
};
</script>

<style lang="scss" scoped>
@import "../sass/colors", "../sass/typography", "../sass/effects";

.keyItem {
  width: 700px;
  background-color: $white;
  border-radius: 5px;
  padding: 1em;
  @extend .shadow-soft;
  margin: 1em 0;

  .meta {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;

    .info {
      padding-right: 5em;
      .name {
        display: block;
        font-size: $font-small;
        color: $black;
        width: 100%;
      }
      .description {
        display: block;
        font-size: $font-small;
        font-weight: 400;
        color: $gray;
        margin-top: 0.2em;
        width: 100%;
      }
    }

    .actions {
      background-color: $gray-light;
      display: flex;
      align-content: center;
      padding: 0.2em;
      border-radius: 5px;
      column-gap: 0.2em;
      .icon {
        font-size: 1.3em;
        padding: 0.2em;
        border-radius: 3px;
        cursor: pointer;
        transition: 0.3s ease-in-out;

        &.info {
          color: $info;
          &:hover {
            background-color: rgba($info, 0.1);
          }
        }
        &.warning {
          color: $warning;
          &:hover {
            background-color: rgba($warning, 0.1);
          }
        }
        &.error {
          color: $error;
          &:hover {
            background-color: rgba($error, 0.1);
          }
        }
        &.success {
          color: $success;
          &:hover {
            background-color: rgba($success, 0.1);
          }
        }
      }
    }
  }

  @keyframes key__in {
    0% {
      opacity: 0;
      padding-top: 0;
      margin-top: 0;
      border-top-width: 0;
    }
    25% {
      height: auto;
    }
    25% {
      padding-top: 1em;
      margin-top: 1em;
      opacity: 1;
      border-top-width: 1px;
    }
    100% {
      opacity: 1;
      padding-top: 1em;
      margin-top: 1em;
      height: auto;
      border-top-width: 1px;
    }
  }
  @keyframes key__out {
    0% {
      opacity: 1;
      padding-top: 1em;
      margin-top: 1em;
      border-top-width: 1px;
    }
    25% {
      padding-top: 0;
      margin-top: 0;
      opacity: 0;
      border-top-width: 0;
    }
    75% {
      height: 0;
    }
    100% {
      opacity: 0;
      padding-top: 0;
      margin-top: 0;
      height: 0;
      border-top-width: 0;
    }
  }

  .key {
    animation: key__in 1s ease-in forwards;
    display: flex;
    align-items: center;
    border-top: 1px solid rgba($gray, 0.5);
    padding-top: 1em;
    margin-top: 1em;

    &.closing {
      animation: key__out 0.8s ease-out forwards;
    }

    .value {
      width: 100%;
      font-family: "Roboto Mono", monospace;
      background-color: $gray-light;
      padding: 0.5em 1em 0.3em 1em;
      border-radius: 5px;
      color: rgba($black, 0.7);
      font-size: $font-small;
      text-overflow: clip;
      overflow-x: scroll;

      &::-webkit-scrollbar {
        height: 5px;
      }

      &::-webkit-scrollbar-track {
        background: $gray-light;
      }

      &::-webkit-scrollbar-thumb {
        background: $gray;
        &:hover {
          background: rgba($gray, 0.5);
        }
      }
    }

    .copy {
      position: relative;

      .icon {
        font-size: 1.3em;
        padding: 0.35em;
        margin-left: 0.2em;
        border-radius: 3px;
        background-color: $gray-light;
        color: $gray;
        cursor: pointer;
        transition: background 0.3s ease-in;

        &:hover {
          background-color: rgba($gray, 0.3);
        }
      }

      .tooltip {
        position: absolute;
        top: calc(-50% - 15px);
        right: -8px;
        padding: 5px 0;
        color: transparent;
        .text {
          display: block;
          opacity: 0;
          animation: tooltip-body__in 0.2s ease-in 0.1s forwards;
          background-color: rgba($black, 0.6);
          font-size: $font-smaller;
          font-weight: 500;
          letter-spacing: 0.4px;
          padding: 5px 8px;
          border-radius: 3px 3px 0 3px;
          backdrop-filter: blur(1px);
        }
        .arrow {
          opacity: 0;
          animation: tooltip-arrow__in 0.1s ease-in forwards;
          position: absolute;
          bottom: 0;
          right: 0.2px;
          transform: translateY(calc(100% - 5px)) !important;
          width: 0;
          height: 0;
          border-style: solid;
          border-width: 5px 5px 0 0;
          border-color: rgba($black, 0.8) transparent transparent transparent;
        }
      }
    }
  }
}

@keyframes tooltip-body__in {
  from {
    opacity: 0;
    transform-origin: right;
    transform: scaleX(0);
    color: transparent;
  }
  to {
    opacity: 1;
    transform-origin: right;
    transform: scaleX(1);
    color: $white;
  }
}

@keyframes tooltip-arrow__in {
  from {
    opacity: 0;
    transform: scaleY(0);
  }
  to {
    opacity: 1;
    transform-origin: bottom;
    transform: scaleY(1);
  }
}

.tooltip-arrow__closing {
  animation: tooltip-arrow__out 0.1s ease-in forwards !important;
}
.tooltip-text__closing {
  animation: tooltip-body__out 0.1s ease-in forwards !important;
}

@keyframes tooltip-body__out {
  from {
    opacity: 1;
    transform-origin: right;
    transform: scaleX(1);
    color: $white;
  }
  to {
    opacity: 0;
    transform-origin: right;
    transform: scaleX(0);
    color: transparent;
  }
}

@keyframes tooltip-arrow__out {
  from {
    opacity: 1;
  }
  to {
    opacity: 0;
  }
}
</style>
