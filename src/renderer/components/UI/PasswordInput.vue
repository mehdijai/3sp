<template>
  <div class="password">
    <Input
      class="password-input"
      :name="name"
      :label="label === null ? 'Password' : label"
      :type="type"
      :error="error"
      :disabled="disabled"
      :required="required"
      v-model="password"
    />
    <span
      :class="error ? 'error' : ''"
      @click="toggleVisibility"
      class="material-icons icon"
      >{{ type === "password" ? "visibility" : "visibility_off" }}</span
    >
  </div>
  <div v-if="strength" class="strength">
    <div class="block" :class="validation.uppercase ? 'success' : 'fail'">
      <span class="name">Uppercase</span>
    </div>
    <div class="block" :class="validation.lowercase ? 'success' : 'fail'">
      <span class="name">Lowercase</span>
    </div>
    <div class="block" :class="validation.numbers ? 'success' : 'fail'">
      <span class="name">Numbers</span>
    </div>
    <div class="block" :class="validation.symboles ? 'success' : 'fail'">
      <span class="name">Symbols</span>
    </div>
    <div class="block" :class="validation.minchar ? 'success' : 'fail'">
      <span class="name">16+ chars</span>
    </div>
  </div>
  <div v-if="generator" class="generate-password">
    <Button mode="primary-ghost" @click="generatePassword">
      Generate a random password
    </Button>
  </div>
</template>

<script>
import { reactive, ref, watchEffect } from "vue";
import { Input, Button } from "../Components";

export default {
  name: "PasswordInput",
  components: {
    Input,
    Button,
  },
  props: {
    modelValue: String,
    error: String,
    name: {
      type: String,
      default: "password",
    },
    label: {
      type: String,
      default: null,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    required: {
      type: Boolean,
      default: false,
    },
    strength: {
      type: Boolean,
      default: true,
    },
    generator: {
      type: Boolean,
      default: true,
    },
  },
  emits: ["update:modelValue", "valid"],
  setup(props, context) {
    const type = ref("password");

    function toggleVisibility() {
      if (type.value === "password") {
        type.value = "text";
      } else {
        type.value = "password";
      }
    }

    const password = ref(props.modelValue);

    const validation = reactive({
      uppercase: false,
      lowercase: false,
      numbers: false,
      symboles: false,
      minchar: false,
    });

    function validate() {
      const uppercase = /[A-Z]+/g;
      const lowercase = /[a-z]+/g;
      const numbers = /[0-9]+/g;
      const symboles =
        /[éàçè&åäöÅÄÖ&()+%/*$€é,.'"_\-=~#{[|`^@\]}£*µù!:;?§<>²]/g;
      const minchar =
        /^[a-zA-Z0-9éàçè&åäöÅÄÖ&()+%/*$€é,.'"_\-=~#{[|`^@\]}£*µù!:;?§<>²]{16}/g;
      validation.uppercase = uppercase.test(password.value);
      validation.lowercase = lowercase.test(password.value);
      validation.numbers = numbers.test(password.value);
      validation.symboles = symboles.test(password.value);
      validation.minchar = minchar.test(password.value);

      return (
        validation.uppercase &&
        validation.lowercase &&
        validation.numbers &&
        validation.symboles &&
        validation.minchar
      );
    }

    watchEffect(() => {
      let valid = validate();
      context.emit("valid", valid);
      context.emit("update:modelValue", password.value);
    });

    function generatePassword() {
      let chars =
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_@&";

      let str = "";
      for (let i = 0; i < 20; i++) {
        str += chars.charAt(Math.floor(Math.random() * chars.length));
      }

      password.value = str;
    }

    return { toggleVisibility, password, type, validation, generatePassword };
  },
};
</script>

<style lang="scss" scoped>
@import "../../sass/colors", "../../sass/typography";

$size-base: 0.8em;

.password {
  position: relative;

  .icon {
    top: 50%;
    right: $size-base;
    font-size: 1.3em;
    transform: translateY(calc(-50% + 0.5em));
    position: absolute;
    cursor: pointer;
    color: $primary;
    transition: color 0.3s ease, right 0.3s ease-in-out;

    &:hover {
      right: 0.7em;
      color: $primary-light;
    }
    &.error {
      transform: translateY(calc(-50%));
      color: $error !important;
    }
  }
}
.strength {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 1em;
  .block {
    position: relative;
    padding-top: 0.2em;
    transition: color 0.3s ease-in-out;

    &::before {
      content: " ";
      width: 100%;
      height: 2.3px;
      border-radius: 1px;
      position: absolute;
      top: 0;
      right: 0;
      transition: background 0.3s ease-in-out;
    }

    &.success {
      color: $success;
      &::before {
        background-color: $success;
      }
    }

    &.fail {
      color: $error;
      &::before {
        background-color: $error;
      }
    }

    .name {
      font-weight: 700;
      font-size: $font-smaller;
    }
  }
}
.generate-password {
  color: $primary-light;
  font-weight: 500;
  margin: 0.8rem 0;
}
</style>
