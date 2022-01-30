<template>
  <div class="loading">
    <div class="dot"></div>
    <div class="dot"></div>
    <div class="dot"></div>
  </div>
</template>

<script>
export default {
  name: "Loader",
};
</script>

<style lang="scss" scoped>
@import "../../sass/colors";

.loading {
  position: fixed;
  top: 0;
  right: 0;
  z-index: 100;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba($gray, 0.2);
  backdrop-filter: blur(5px);

  .dot {
    height: 20px;
    width: 20px;
    background: $secondary;
    margin: 0 0.5em;
    border-radius: 3px;
    animation: loading 1.5s ease-in-out 0s infinite;

    &:nth-child(1) {
      animation-delay: 0s;
    }
    &:nth-child(2) {
      animation-delay: 0.2s;
    }
    &:nth-child(3) {
      animation-delay: 0.4s;
    }
  }
}

@keyframes loading {
  0% {
    transform: translateY(0);
  }

  50% {
    transform: translateY(10px);
  }

  100% {
    transform: translateY(0);
  }
}
</style>
