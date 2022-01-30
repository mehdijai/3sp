<template>
  <div class="container">
    <div ref="modalBody" class="modal">
      <header class="modal-header">
        <slot name="header"></slot>
      </header>
      <article class="modal-body">
        <slot name="body"></slot>
      </article>
      <footer class="modal-footer">
        <slot name="footer"></slot>
      </footer>
    </div>
  </div>
</template>

<script>
import { ref } from "vue";

export default {
  name: "Modal",
  setup() {
    const modalBody = ref(null);
    return { modalBody };
  },
};
</script>

<style lang="scss" scoped>
@import "../sass/colors", "../sass/typography", "../sass/effects";

.container {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 99;
  height: 100vh;
  width: 100vw;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba($primary, 0.5);
  backdrop-filter: blur(5px);

  .modal {
    animation: modal__in 0.1s ease-out forwards;
    width: 450px;
    background: $white;
    border-radius: 5px;
    @extend .shadow-soft;
    padding: 1em 2em;

    .modal-header {
      color: $secondary;
      font-weight: 500;
      font-size: 0.8em;
      text-align: center;
    }

    .modal-body {
      color: $black;
      margin: 2em 0;
      font-size: $font-small;
      text-align: justify;
    }

    .modal-footer {
      display: flex;
      justify-content: center;
      column-gap: 1em;
    }
  }
}

.closing {
  animation: modal__out 0.2s ease-out forwards !important;
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
