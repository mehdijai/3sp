<template>
  <button :type="type" :class="'button ' + mode">
    <slot></slot>
  </button>
</template>

<script>
export default {
  name: "Button",
  props: {
    mode: {
      type: String,
      default: "primary",
    },
    type: {
      type: String,
      default: "button",
    },
  },
};
</script>

<style lang="scss" scoped>
@import "../../sass/colors", "../../sass/typography";

.button {
  font-size: $font-small;
  border: none;
  padding: 0.5em 0.9em;
  margin: 0.3em 0;
  border-radius: 5px;
  cursor: pointer;
  transition: background 0.3s ease-in-out;

  &.primary {
    background-color: $primary;
    color: $white;
    font-weight: 500;
    &:hover {
      background-color: $primary-light;
    }
  }

  &.primary-ghost {
    background-color: transparent;
    color: $primary-light;
    padding: 0;
    font-weight: 600;
    &:hover {
      color: rgba($primary, 0.8);
    }
  }

  &.secondary {
    background-color: $secondary;
    color: $white;
    font-weight: 500;
    &:hover {
      background-color: $secondary-light;
    }
  }

  &.secondary-ghost {
    background-color: transparent;
    color: $secondary-light;
    padding: 0;
    font-weight: 600;
    &:hover {
      color: rgba($secondary, 0.8);
    }
  }
}
</style>
