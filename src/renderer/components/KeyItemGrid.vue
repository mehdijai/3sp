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
  <div class="key-item">
    <div class="content">
      <strong class="title">{{ keyItem.name }}</strong>
      <p class="description">
        {{ keyItem.description || "no description is set!" }}
      </p>
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
    <div v-if="show" ref="keyWrapper" class="private-key">
      <span class="key-value">{{ keyItem.key }}</span>
      <Tooltip
        v-if="copied"
        AttrClass="tooltip"
        :customClass="tooltipClass"
        ref="tooltipRef"
        content="Copied!"
      />
      <span @click="copy" class="copy-icon material-icons">content_copy</span>
    </div>
  </div>
</template>

<script>
import { ref, reactive, watch, computed } from "vue";
import Tooltip from "./UI/tooltip";
import { Modal, Button } from "./Components";
import { useRouter } from "vue-router";
import { useStore } from "vuex";

export default {
  name: "KeyItemGrid",
  components: {
    Tooltip,
    Modal,
    Button,
  },
  props: {
    keyItem: Object,
    displayed: String,
  },
  emits: ["show"],
  setup(props, context) {
    const keyWrapper = ref(null);

    function showKey() {
      context.emit("show", props.keyItem.uuid);
    }
    function hideKey() {
      keyWrapper.value.classList.add("key__closing");
      setTimeout(() => {
        context.emit("show", null);
      }, 500);
    }

    const show = computed(() => {
      return props.displayed === props.keyItem.uuid;
    });

    const copied = ref(false);
    const tooltipRef = ref(null);
    const tooltipClass = reactive({ text: "", arrow: "" });

    function copy() {
      navigator.clipboard.writeText(props.keyItem.key);
      copied.value = true;
    }

    watch(tooltipRef, (element) => {
      if (element) {
        setTimeout(() => {
          tooltipClass.text = "tooltip-text__closing";
          tooltipClass.arrow = "arrow__closing";
        }, 2000);

        setTimeout(() => {
          copied.value = false;
          tooltipClass.text = "";
          tooltipClass.arrow = "";
        }, 2200);
      }
    });

    const toDelete = ref(null);

    function handleDelete() {
      toDelete.value = props.keyItem.uuid;
    }

    const store = useStore();

    function confirmDelete() {
      store.dispatch("deleteKey", props.keyItem.uuid);
      toDelete.value = null;
    }
    function cancelDelete() {
      toDelete.value = null;
    }

    const router = useRouter();

    function handleEdit() {
      router.push({ name: "edit", params: { uuid: props.keyItem.uuid } });
    }

    return {
      show,
      showKey,
      hideKey,
      keyWrapper,
      copy,
      tooltipClass,
      tooltipRef,
      copied,
      handleDelete,
      handleEdit,
      cancelDelete,
      confirmDelete,
      toDelete,
    };
  },
};
</script>

<style lang="sass" scoped>
@import "../sass/colors", "../sass/typography"

.key-item
    width: 220px
    display: flex
    flex-direction: column
    .content
        z-index: 1
        background-color: $white
        padding: 1em
        border-radius: 5px
        box-shadow: 0 10px 20px rgba($gray, 0.3)
        .title
            display: block
            font-size: $font-small
            color: $black
        .description
            display: block
            font-size: $font-small
            font-weight: 400
            color: $gray
            margin-top: 0.2em
        .actions
            display: flex
            justify-content: space-between
            align-items: center
            margin-top: 1em
            padding: 0 1em
            .icon
                font-size: 1em
                background-color: $gray-lighter
                padding: 0.4em 0.7em
                border-radius: 5px
                cursor: pointer
                transition: 0.3s ease-in-out
                &.info
                    color: $info
                    &:hover
                        background-color: rgba($info, 0.1)
                &.warning
                    color: $warning
                    &:hover
                        background-color: rgba($warning, 0.1)
                &.error
                    color: $error
                    &:hover
                        background-color: rgba($error, 0.1)
                &.success
                    color: $success
                    &:hover
                        background-color: rgba($success, 0.1)
    .private-key
        z-index: 0
        animation: key__in 0.5s ease-out forwards
        background-color: $white
        padding: 2.5em 1em 1em 1em
        border-radius: 5px
        position: relative !important
        width: 100%
        display: flex
        .key-value
          width: 100%
          overflow-x: scroll
          text-overflow: clip
          font-family: "Roboto Mono", monospace
          background-color: $gray-light
          cursor: text
          padding: 0.5em 1em 0.3em 1em
          border-radius: 5px
          color: rgba($black, 0.7)
          font-size: $font-small
          &::-webkit-scrollbar
            height: 5px
          &::-webkit-scrollbar-track
            background: $gray-lighter
          &::-webkit-scrollbar-thumb
            background: $gray
            &:hover
              background: rgba($gray, 0.5)
        .copy-icon
          position: absolute
          cursor: pointer
          background: $gray-light
          color: $gray
          font-size: 1.2em
          top: 50%
          right: 0.8em
          transform: translateY(calc(-50% + 0.5em))
          padding: 0.3em 0.2em
          transition: background 0.2s ease
          &:hover
            background: $gray-lighter
        .tooltip
          z-index: 99
          position: absolute
          top: 1em
          right: 0.7em

.key__closing
  animation: key__out 0.5s ease-out forwards !important

@keyframes key__in
  from
    transform: translateY(-100%)
  to
    transform: translateY(-1em)

@keyframes key__out
  from
    transform: translateY(-1em)
  to
    transform: translateY(-100%)
</style>
