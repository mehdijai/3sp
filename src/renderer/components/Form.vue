<template>
  <form @submit="handleForm" class="form">
    <header class="form-header">
      <slot name="header"></slot>
    </header>
    <section class="form-body">
      <slot name="body"></slot>
    </section>
    <footer class="form-footer">
      <slot name="footer"></slot>
    </footer>
  </form>
</template>

<script>
export default {
  name: "Form",
  emits: ["submit"],
  setup(_, context) {
    function handleForm(e) {
      context.emit("submit", e);
    }

    return { handleForm };
  },
};
</script>

<style lang="scss" scoped>
@import "../sass/colors", "../sass/effects";

.form {
  background-color: $gray-lighter;
  border-radius: 5px;
  @extend .shadow-soft;
  padding: 3em 4em;
  width: 450px;

  .form-header {
    display: flex;
    flex-direction: column;
    align-items: center;
    row-gap: 1.3em;
  }
  .form-body {
    margin: 2em 0;
  }
  .form-footer {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-items: center;
    row-gap: 1.3em;
  }
}
</style>
