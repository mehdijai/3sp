<template>
  <div class="search">
    <Input
      :name="'search'"
      :label="'Search'"
      type="text"
      :error="error"
      :disabled="disabled"
      :required="false"
      v-model="search"
    />
    <button
      @click="submit"
      v-if="search !== ''"
      :class="error ? 'error' : ''"
      class="material-icons icon"
    >
      close
    </button>
  </div>
</template>

<script>
import { computed, ref, watchEffect } from "vue";
import { Input } from "./Components";

export default {
  name: "SearchInput",
  components: {
    Input,
  },
  props: {
    modelValue: String,
    error: String,
    disabled: {
      type: Boolean,
      default: false,
    },
  },
  emits: ["update:modelValue", "submit"],
  setup(props, context) {
    const search = ref(props.modelValue);

    watchEffect(() => {
      context.emit("update:modelValue", search.value);
    });

    function submit() {
      context.emit("submit", search.value);
      search.value = "";
    }

    const buttonCls = computed(() => {
      let btnClass = "";
      if (props.error) btnClass += "error";
      if (props.live) btnClass += "live";

      return btnClass;
    });

    return { search, submit, buttonCls };
  },
};
</script>

<style lang="scss" scoped>
@use "sass:math";
@import "../sass/colors", "../sass/typography";

$size-base: 0.8em;

.search {
  position: relative;

  .icon {
    border: none;
    background: $secondary;
    top: calc(50% + 0.2em);
    right: math.div($size-base, 2);
    font-size: 1.1em;
    transform: translateY(calc(-50% + 0.5em));
    position: absolute;
    color: $white;
    padding: 0.15em;
    border-radius: 3px;

    cursor: pointer;
    transition: background 0.3s ease, right 0.3s ease-in-out;

    &:hover {
      right: math.div($size-base, 1.6);
      background: $secondary-light;
    }

    &.error {
      transform: translateY(calc(-50%));
      color: $error !important;
    }
  }
}
</style>
