<template>
  <div ref="not" class="notification" :class="type">
    <div class="not-icons not-type">
      <span class="material-icons">{{ message_icon }}</span>
    </div>
    <div class="not-message">
      <p v-html="message"></p>
    </div>
    <div @click="closeNotification" class="not-icons not-close">
      <span class="material-icons">close</span>
    </div>
  </div>
</template>

<script>
import { computed, ref } from "vue";
export default {
  name: "Notification",
  props: {
    type: {
      type: String,
      default: "success", // success | error | warning | info
    },
    message: String,
  },
  emits: ["clear"],
  setup(props, context) {
    const not = ref(null);
    const message_icon = computed(() => {
      switch (props.type) {
        case "success":
          return "check_circle";
        case "error":
          return "error";
        case "warning":
          return "warning";
        case "info":
          return "info";
        default:
          return "info";
      }
    });

    function closeNotification() {
      not.value.classList.add("closing");
      setTimeout(() => {
        context.emit("clear");
      }, 500);
    }

    return { not, message_icon, closeNotification };
  },
};
</script>

<style lang="scss" scoped>
@import "../sass/colors", "../sass/typography", "../sass/effects";
.notification {
  animation: not-wrapper__in 0.5s ease-in-out forwards;
  position: fixed;
  z-index: 99;
  top: 0.8em;
  left: 50%;
  width: 490px;
  border-radius: 5px;
  @extend .shadow-soft;
  padding: 0.8em;
  display: flex;
  align-items: flex-start;
  justify-content: space-between;

  .not-icons {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0.4em;

    &.not-close {
      cursor: pointer;
      border-radius: 5px;
      background-color: transparent;
      transition: background 0.4s ease;

      &:hover {
        background-color: rgba($error, 0.1);
      }
    }
  }

  .not-message {
    font-size: $font-small;
    line-height: 1.5;
    font-weight: 500;
    padding: 0.4em 0;
  }

  &.success {
    background-color: lighten($success, 35);
    color: darken($success, 0.5);
  }

  &.error {
    background-color: lighten($error, 35);
    color: darken($error, 0.5);
  }
  &.warning {
    background-color: lighten($warning, 35);
    color: darken($warning, 0.5);
  }
  &.info {
    background-color: lighten($info, 35);
    color: darken($info, 0.5);
  }
}

.closing {
  animation: not-wrapper__out 0.5s ease-in-out forwards !important;
}

@keyframes not-wrapper__in {
  from {
    opacity: 0;
    transform: translateY(-100%) translateX(-50%);
  }
  to {
    opacity: 1;
    transform: translateY(0) translateX(-50%);
  }
}

@keyframes not-wrapper__out {
  from {
    opacity: 1;
    transform: translateY(0) translateX(-50%);
  }
  to {
    opacity: 0;
    transform: translateY(-100%) translateX(-50%);
  }
}
</style>
