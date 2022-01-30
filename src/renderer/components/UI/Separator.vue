<template>
  <div
    v-if="dir === 'v'"
    :style="`height : ${size}%;`"
    :class="colorMode"
    class="separator__vertical"
  ></div>
  <div
    v-if="dir === 'h'"
    :style="`width: ${size}%;`"
    :class="colorMode"
    class="separator__horizontal"
  ></div>
</template>

<script>
export default {
  name: "Separator",
  props: {
    dir: {
      type: String,
      default: "h",
    },
    colorMode: {
      type: String,
      default: "primary",
    },
    size: {
      type: Number,
      default: 80,
    },
  },
};
</script>

<style lang="scss">
@import "../../sass/colors";

.separator__vertical {
  width: 0;
  margin: 0 1em;

  &.primary {
    border-right: 5px solid $primary;
  }
  &.primary-ghost {
    border-right: 5px solid $primary-light;
  }
  &.secondary {
    border-right: 5px solid $secondary;
  }
  &.secondary-ghost {
    border-right: 5px solid $secondary-light;
  }
}
.separator__horizontal {
  height: 0;
  background-color: transparent;
  border-top-width: 1.5px;
  border-top-style: solid;
  margin: 1em 0;

  &.primary {
    border-top-color: $primary;
  }
  &.primary-ghost {
    border-top-color: $primary-light;
  }
  &.secondary {
    border-top-color: $secondary;
  }
  &.secondary-ghost {
    border-top-color: $secondary-light;
  }
}
</style>
