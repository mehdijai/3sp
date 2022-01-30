<template>
  <div
    v-if="type !== 'select' && type !== 'checkbox'"
    class="input"
    :class="classAttributes"
    :style="`width: ${width}`"
  >
    <input
      class="input-field"
      :class="error ? 'error' : ''"
      @input="handleInput"
      :value="modelValue"
      :type="type"
      :name="name"
      :disabled="disabled"
      :readonly="readOnly"
      :required="required"
      placeholder=" "
      autocomplete="off"
      ref="inpt"
    />
    <label
      :class="error ? 'error' : ''"
      class="input-label"
      @click="this.$refs.inpt.focus()"
      :for="name"
      >{{ label }}</label
    >
    <div v-if="error" class="input-error">
      <span class="material-icons error-icon">error_outline</span>
      <span class="error-message">{{ error }}</span>
    </div>
  </div>
  <select
    v-if="type === 'select'"
    class="select-input"
    :name="name"
    :disabled="disabled"
    :readonly="readOnly"
    :required="required"
    :value="modelValue"
    @input="handleInput"
  >
    <slot></slot>
  </select>
  <label v-if="type === 'checkbox'" class="checkbox-container">
    <input
      type="checkbox"
      class="checkbox-input"
      :name="name"
      :disabled="disabled"
      :readonly="readOnly"
      :required="required"
      :checked="modelValue"
      @input="handleInput"
    />
    <span class="checkmark"></span>
  </label>
</template>

<script>
import { computed } from "@vue/reactivity";
export default {
  name: "InputBase",
  props: {
    modelValue: {
      type: [String, Boolean],
    },
    width: {
      type: String,
      default: "auto",
    },
    class: String,
    name: String,
    label: String,
    error: String,
    disabled: { type: Boolean, default: false },
    readOnly: { type: Boolean, default: false },
    required: { type: Boolean, default: false },
    type: {
      type: String,
      default: "text",
    },
  },
  emits: ["update:modelValue"],
  setup(props, context) {
    function handleInput(e) {
      if (props.type === "checkbox") {
        context.emit("update:modelValue", props.modelValue);
      } else {
        context.emit("update:modelValue", e.target.value);
      }
    }

    const classAttributes = computed(() => {
      let cls = props.class;
      if (props.error) cls += " error";
      return cls;
    });

    return { handleInput, classAttributes };
  },
};
</script>

<style lang="scss" scoped>
@use "sass:math";
@import "../../sass/colors", "../../sass/typography";

$size-base: 0.8em;
$placeholder-adj: translateY(calc(50% - 0.4em));
$placeholder-top: calc(1em + $size-base);
$label-top: calc(math.div($size-base, 6) - 0.2em);

.input {
  position: relative;
  padding-top: 1em;
  transition: padding 0.3s ease-in-out;
  margin-top: 0.5em;
  &.error {
    padding-bottom: 1em;
  }

  .input-error {
    position: absolute;
    bottom: 0;
    left: $size-base;
    display: flex;
    align-items: center;
    color: $error;
    font-weight: 700;
    .error-icon {
      font-size: 1rem;
      opacity: 0;
      margin-right: 0.2rem;
      animation: error-icon__in 0.5s ease-in forwards;
    }

    .error-message {
      font-size: 0.8rem;
      opacity: 0;
      animation: error-text__in 0.5s ease-in 0.2s forwards;
    }
  }
  .input-field {
    margin: 0.5em 0;
    width: 100%;
    border: none;
    border-left: 3px solid transparent;
    background-color: $white;
    padding: $size-base;
    border-radius: 3px;
    color: $black;
    transition: border 0.3s ease;

    &:not(:placeholder-shown) + .input-label,
    &:focus + .input-label {
      font-size: $font-small;
      font-weight: 500;
      color: $primary;
      top: $label-top;
    }
    &:focus {
      border-color: $primary;
    }

    &:disabled,
    &:read-only {
      background-color: darken($gray-light, 20);
      @at-root input:disabled,
        input:read-only + .input-label {
        color: $gray !important;
        cursor: default;
      }
    }

    &.error {
      border: 2px solid $error !important;
      color: $error !important;

      &:disabled,
      &:read-only {
        background-color: rgba($gray, 0.2) !important;
        border: 1px solid rgba($gray, 0.7) !important;

        @at-root & + .input-label {
          color: $gray !important;
        }
      }
    }
  }

  .input-label {
    user-select: none;
    cursor: text;
    position: absolute;
    top: $placeholder-top;
    transform: $placeholder-adj;
    left: $size-base;
    font-size: $font-base;
    color: $gray;
    transition: top 0.3s ease, font-size 0.3s ease, color 0.3s ease;

    &.error {
      color: $error !important;
      top: calc($placeholder-top + 1px);
    }
  }
}

.select-input {
  margin: 0.5em 0;
  width: 100%;
  border: none;
  border-left: 3px solid transparent;
  background-color: $white;
  padding: $size-base;
  border-radius: 3px;
  color: $black;
  transition: border 0.3s ease;
}

.checkbox-container {
  position: relative;
  display: block;
  padding: 0 0.3em;
  .checkbox-input {
    opacity: 0;
    height: 0;
    width: 0;
    display: none;

    &:checked ~ .checkmark {
      background: $primary;
    }
  }
  .checkmark {
    display: block;
    background: rgba($gray, 0.3);
    height: 1em;
    width: 1em;
    border-radius: 3px;
  }
}

.error-text__closing {
  animation: error-text__out 0.5s ease-in 0.2s forwards;
}
.error-icon__closing {
  animation: error-icon__out 0.5s ease-in forwards;
}

@keyframes error-text__in {
  from {
    opacity: 0;
    transform-origin: left top;
    transform: translateX(math.div(-$size-base, 2)) scaleX(0);
  }
  to {
    opacity: 1;
    transform-origin: left top;
    transform: translateX(0) scaleX(1);
  }
}
@keyframes error-text__out {
  from {
    opacity: 1;
    transform-origin: left top;
    transform: translateX(0) scaleX(1);
  }
  to {
    opacity: 0;
    transform-origin: left top;
    transform: translateX(math.div(-$size-base, 2)) scaleX(0);
  }
}
@keyframes error-icon__in {
  from {
    opacity: 0;
    transform: translateX(-$size-base);
  }
  to {
    opacity: 1;
    transform: translateW(0);
  }
}
@keyframes error-icon__out {
  from {
    opacity: 1;
    transform: translateW(0);
  }
  to {
    opacity: 0;
    transform: translateX(-$size-base);
  }
}
</style>
