<template>
  <div class="container">
    <Modal v-if="alert">
      <template v-slot:header>
        <h1>Are you sure you want to clear all the key?</h1>
      </template>
      <template v-slot:body>
        Be carefully! If you choose this mode, all the saved keys will be
        cleared and the new imported keys will be added.
      </template>
      <template v-slot:footer>
        <Button @click="confirmClearImport" mode="secondary">Confirm</Button>
        <Button @click="cancelClearImport" mode="primary-ghost">Cancel</Button>
      </template>
    </Modal>
    <div class="import-modal" ref="modal">
      <aside class="sidebar">
        <h2 class="title">Select import mode</h2>
        <div class="mode-form">
          <small class="input-help">
            <em>
              If we found similar <strong>{{ mode.value }}</strong> to the
              imported key on the database we will add it according the mode
              type bellow.
            </em>
          </small>
          <span class="form-label">Select import mode identifier</span>
          <Input type="select" v-model="mode.value">
            <option value="name">Name</option>
            <option value="description">Description</option>
          </Input>

          <span class="form-label">Select import mode</span>
          <Input type="select" v-model="mode.type">
            <option value="duplicate">Duplicate</option>
            <option value="overwrite">Overwrite</option>
            <option value="keep_old">Keep old keys</option>
            <option value="clear">Clear all old keys</option>
          </Input>

          <div class="form-cta">
            <Button @click="handleImport" type="submit" mode="primary"
              >Import</Button
            >
            <Button @click="handleCancel" mode="primary-ghost">Cancel</Button>
          </div>
        </div>
      </aside>
      <article class="body">
        <header class="navigation">
          <div
            @click="toggleSelectAll"
            class="checkbox"
            :class="allSelected ? 'checked' : ''"
          ></div>
          <label for="all" class="navigation-label">Select all</label>
          <SearchInput class="search-input" v-model="search" />
        </header>
        <section class="keys-list-container">
          <ul class="keys-list">
            <li class="key-wrapper" v-for="(key, index) in keys" :key="index">
              <div
                class="imported-key"
                @click="handleSelect(key)"
                :class="key.selected ? 'selected' : ''"
              >
                <div
                  class="checkbox"
                  :class="key.selected ? 'checked' : ''"
                ></div>
                <strong class="title">{{ key.name }}</strong>
                <small class="description">{{ key.description }}</small>
              </div>
            </li>
          </ul>
        </section>
      </article>
    </div>
  </div>
</template>

<script>
import { computed, reactive, ref, watch } from "vue";
import { SearchInput, Button, Input, Modal } from "./Components";
import { useStore } from "vuex";

export default {
  name: "ImportList",
  components: {
    Button,
    SearchInput,
    Input,
    Modal,
  },
  emits: ["close"],
  setup(_, ctx) {
    const store = useStore();

    const search = ref("");

    const keys = computed(() => {
      return store.getters.imported
        .map((key) => {
          key.selected = false;
          return key;
        })
        .filter((key) => {
          if (key != null) {
            return (
              key.name.includes(search.value) ||
              key.description.includes(search.value) ||
              key.key.includes(search.value)
            );
          } else {
            return true;
          }
        });
    });

    const allSelected = ref(false);

    function handleSelect(selectedKey) {
      let index = keys.value.findIndex((key) => key.uuid === selectedKey.uuid);
      keys.value[index].selected = !selectedKey.selected;

      let selected = keys.value.map((key) => {
        return key.selected;
      });

      if (
        selected.every((val, i, arr) => val === arr[0]) &&
        selected[0] === true
      ) {
        allSelected.value = true;
      } else {
        allSelected.value = false;
      }
    }

    function toggleSelectAll() {
      allSelected.value = !allSelected.value;
      keys.value.map((key) => {
        key.selected = allSelected.value;
        return key;
      });
    }

    const modal = ref(null);
    function handleCancel() {
      modal.value.classList.add("closing");
      setTimeout(() => {
        ctx.emit("close");
      }, 500);
    }

    const mode = reactive({ type: "duplicate", value: "name" });

    const alert = ref(false);
    let confirm = false;
    let modeBfCnf = null;

    watch(mode, (to, from) => {
      if (to.type === "clear" && confirm === false) {
        alert.value = true;
        modeBfCnf = from;
      }
    });

    function confirmClearImport() {
      confirm = true;
      alert.value = false;
      modeBfCnf = null;
    }

    function cancelClearImport() {
      mode.value = modeBfCnf;
      alert.value = false;
    }

    function handleImport() {
      let selectedKeys = keys.value
        .filter((key) => key.selected)
        .map((key) => key.uuid);
      if (selectedKeys.length > 0) {
        store.dispatch("importKeys", { selectedKeys, mode });
        modal.value.classList.add("closing");
        setTimeout(() => {
          ctx.emit("close");
        }, 500);
      } else {
        store.commit("setError", {
          status: false,
          data: "You have to select at least one key to be able to import",
        });
      }
    }

    return {
      mode,
      keys,
      allSelected,
      toggleSelectAll,
      handleSelect,
      handleCancel,
      handleImport,
      modal,
      search,
      confirmClearImport,
      cancelClearImport,
      alert,
    };
  },
};
</script>

<style lang="scss" scoped>
@import "../sass/colors", "../sass/typography", "../sass/effects";

.container {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 70;
  height: 100vh;
  width: 100vw;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba($primary, 0.5);
  backdrop-filter: blur(5px);

  .import-modal {
    animation: modal__in 0.5s ease-out forwards;
    width: 95%;
    background: $gray-lighter;
    border-radius: 5px;
    @extend .shadow-soft;
    padding: 2em;
    display: flex;
    align-items: stretch;
    justify-content: center;
    max-height: 90%;

    .sidebar {
      width: 25%;
      display: flex;
      flex-direction: column;

      .title {
        margin-bottom: 0.5em;
        color: $black;
      }

      .mode-form {
        display: flex;
        height: 100%;
        flex-direction: column;
        align-items: flex-start;
        .form-label {
          font-size: $font-small;
          font-weight: 500;
          margin-top: 1em;
          color: $black;
        }

        .input-help {
          font-size: 0.7em;
          margin-bottom: 0.5em;
          color: $gray;
          font-weight: 500;
          strong {
            color: $secondary !important;
          }
        }

        .form-cta {
          margin-top: auto;
          display: flex;
          align-items: center;
          column-gap: 1em;
        }
      }
    }
    .body {
      display: flex;
      flex-direction: column;
      width: 75%;
      padding: 1em;
      background: transparent;
      .navigation {
        background: $gray-light;
        border-radius: 5px;
        margin-bottom: 1em;
        padding: 0.5em 1em;
        display: flex;
        align-items: center;
        .checkbox {
          margin-right: 1em;
        }
        .navigation-label {
          margin-right: auto;
        }
        .search-input {
          transform: translateY(-0.7em);
        }
      }
      .keys-list-container {
        overflow-y: scroll;
        padding-right: 0.5em;
        border-top: 2px solid $secondary;
        border-bottom: 2px solid $secondary;
        .keys-list {
          list-style: none;
          padding: 0;
          margin: 0;
          .key-wrapper {
            padding: 0;
            margin: 0;

            .imported-key {
              display: flex;
              align-items: center;
              margin: 0.8em 0;
              background: $white;
              padding: 0.5em;
              border-radius: 5px;

              &.selected {
                background: rgba($primary-light, 0.2);
              }

              .title {
                margin: 0 0.5em;
                color: $black;
                font-size: $font-small;
              }
              .description {
                border-left: 1.5px solid rgba($primary-light, 0.5);
                padding-left: 0.5em;
                font-weight: 400;
                color: $gray;
              }
            }
          }
        }
      }
    }
  }
}

.checkbox {
  margin: 0 0.2em;
  display: block;
  background: rgba($gray, 0.3);
  height: 1em;
  width: 1em;
  border-radius: 3px;
  &.checked {
    background: $primary;
  }
}

.closing {
  animation: modal__out 0.5s ease-out forwards !important;
}

@keyframes modal__in {
  from {
    opacity: 0;
    transform: perspective(800px) translateY(50px) rotateX(-20deg);
    perspective: 1000px;
  }
  to {
    opacity: 1;
    transform: perspective(800px) translateY(0) rotateX(0);
    perspective: 1000px;
  }
}

@keyframes modal__out {
  from {
    opacity: 1;
    transform: perspective(800px) translateY(0) rotateX(0);
  }
  to {
    opacity: 0;
    transform: perspective(800px) translateY(50px) rotateX(-20deg);
  }
}
</style>
