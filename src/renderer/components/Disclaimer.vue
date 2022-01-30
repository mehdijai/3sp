<template>
  <div class="container">
    <div class="content">
      <img class="image" src="../assets/alert.svg" alt="Caution!" />
      <div class="copy">
        <slot></slot>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Disclaimer",
};
</script>

<style lang="scss" scoped>
@import "../sass/colors", "../sass/typography";

.container {
  width: 100%;
  padding: 1.5em 0;
  .content {
    position: relative;
    width: 700px;
    margin: 0 auto;
    display: flex;
    background: rgba($gray, 0.2);
    border-radius: 5px;
    padding: 1.5em 2em;
    .image {
      width: 130px;
      position: absolute;
      top: 50%;
      left: 1.5em;
      transform: translateY(-50%);
    }
    .copy {
      color: $black;
      font-size: $font-small;
      margin-left: calc(130px + 1.5em);
    }
  }
}
</style>
