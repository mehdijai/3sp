<template>
  <main class="body">
    <router-view />
  </main>
</template>

<script>
import "material-icons/iconfont/material-icons.css";

export default {
  name: "App",
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
