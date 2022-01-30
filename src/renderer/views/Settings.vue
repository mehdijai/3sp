<template>
  <div class="page-container">
    <Notification
      v-if="errors.messages.length > 0"
      :type="errors.type"
      :message="messages"
      @clear="clearNotification"
    />
    <Modal v-if="confirm">
      <template v-slot:header>
        <h1>Disclaimer!</h1>
      </template>
      <template v-slot:body>
        <b
          >After changing the password, any old exported files (.3sp) can not be
          imported in the future!
        </b>
        <br />
        <small>
          Please backup your data before. Export your keys now, and if some goes
          wrong, log in with the old password, and import the (.3sp) file you
          just exported. <strong>Just to be safe!</strong>
        </small>
      </template>
      <template v-slot:footer>
        <Button @click="confirmUpdate" mode="secondary">Confirm</Button>
        <Button @click="cancelUpdate" mode="primary-ghost">Cancel</Button>
      </template>
    </Modal>
    <Modal v-if="modalClear">
      <template v-slot:header>
        <h1>Disclaimer!</h1>
      </template>
      <template v-slot:body>
        <b
          >This action is not reversible! you wont be able to recover your data!
        </b>
        <br />
        <small> You can back all your keys up by exporting them. </small>
      </template>
      <template v-slot:footer>
        <Button @click="confirmClear" mode="secondary">Confirm</Button>
        <Button @click="cancelClear" mode="primary-ghost">Cancel</Button>
      </template>
    </Modal>
    <Menu />
    <header class="page-header">
      <h1 class="page-title">Settings</h1>
    </header>
    <article class="page-content">
      <section class="section user-brief">
        <h2 class="greeting">Hi {{ $store.getters.username }}!</h2>
        <span class="keys-state"
          >you have {{ $store.getters.keysCount }} keys saved</span
        >
        <small class="version">3SP v{{ $store.getters.appVersion }}</small>
      </section>
      <section class="section user-username">
        <form @submit.prevent="handleUsernameChange" class="user-form">
          <label class="form-title">User info</label>
          <Input
            :name="'username'"
            :label="'Username'"
            :required="true"
            :error="username.error"
            type="text"
            v-model="username.value"
          />
          <Button type="submit" class="cta">Save</Button>
        </form>
      </section>
      <section class="section user-password">
        <form
          ref="updatePasswordForm"
          @submit.prevent="handlePasswordChange"
          class="user-form"
        >
          <label class="form-title">Change password</label>
          <PasswordInput
            name="current_password"
            label="Current password"
            :required="true"
            :error="current_password.error"
            v-model="current_password.value"
            :strength="false"
            :generator="false"
          />
          <PasswordInput
            :required="true"
            :error="new_password.error"
            v-model="new_password.value"
            @valid="handlePasswordValidation"
          />
          <PasswordInput
            name="confirm_password"
            label="Confirm password"
            :required="true"
            :error="confirm_password.error"
            v-model="confirm_password.value"
            :strength="false"
            :generator="false"
          />
          <div class="strength">
            <div
              class="block"
              :class="
                confirm_password.value != '' &&
                confirm_password.value === new_password.value
                  ? 'success'
                  : 'fail'
              "
            >
              <span class="name">Match</span>
            </div>
          </div>
          <Button type="submit" class="cta">Change password</Button>
        </form>
      </section>
      <section class="section donation">
        <BMC />
      </section>
      <section class="section red-zone">
        <p class="desc">
          <strong>Delete all the keys.</strong>
          Be cautious! This action is not reversible. If you do so, you will not
          be able to recover them. Unless you have exported them.
        </p>
        <div class="cta">
          <Button @click="clearAllKeys" mode="secondary">
            Clear all my keys
          </Button>
          <Button @click="deleteMyAccount" mode="secondary">
            Delete my account
          </Button>
        </div>
      </section>
    </article>
  </div>
</template>

<script>
import BMC from "../components/BMC.vue";
import { reactive, computed, watch, ref } from "vue";
import {
  Menu,
  Input,
  PasswordInput,
  Button,
  Notification,
  Modal,
} from "../components/Components";
import { useStore } from "vuex";

export default {
  name: "Settings",
  components: {
    Menu,
    Input,
    PasswordInput,
    Button,
    Notification,
    Modal,
    BMC,
  },
  setup() {
    const store = useStore();
    const username = reactive({ value: store.getters.username, error: null });

    store.dispatch("getAppVersion");

    const errors = reactive({ type: "", messages: [] });
    const messages = computed(() => {
      return errors.messages.join("<br>");
    });

    function setError(type, message, input) {
      if (!errors.type) errors.type = type;
      input.error = message;
      errors.messages.push(message);
    }

    const updateErr = computed(() => {
      return store.getters.errors;
    });

    function handleUsernameChange() {
      if (username.value !== store.getters.username) {
        if (username.value === "") {
          setError("error", "Username is required", username);
        } else {
          store.dispatch("updateUsername", username.value);
        }
      }
    }

    const new_password = reactive({ value: "", error: null });
    const current_password = reactive({ value: "", error: null });
    const confirm_password = reactive({ value: "", error: null });
    const validPassword = ref(false);
    const confirm = ref(false);
    const updatePasswordForm = ref(null);

    function confirmUpdate() {
      confirm.value = false;
      const data = {
        currentPW: current_password.value,
        newPW: new_password.value,
      };
      store.dispatch("updatePassword", data);
    }

    function cancelUpdate() {
      confirm.value = false;
    }

    function handlePasswordValidation(isValid) {
      validPassword.value = isValid;
    }

    function handlePasswordChange() {
      if (current_password.value === "") {
        setError("error", "This field is required", current_password);
      } else if (!validPassword.value) {
        setError("error", "Password must be valid", new_password);
      } else if (confirm_password.value === "") {
        setError("error", "This field is required", confirm_password);
      } else if (current_password.value === new_password.value) {
        setError("warning", "The password is the same!", new_password);
      } else if (confirm_password.value !== new_password.value) {
        setError("error", "Passwords do not match", confirm_password);
      } else {
        clearNotification();
        confirm.value = true;
      }
    }

    function clearNotification() {
      store.commit("clearError");
      errors.type = "";
      errors.messages = [];
      username.error = null;
      new_password.error = null;
      current_password.error = null;
      confirm_password.error = null;
    }

    watch(updateErr, (to) => {
      if (to) {
        errors.type = to.type;
        errors.messages = [to.message];

        if (to.type === "success") {
          updatePasswordForm.value.reset();
        }
        setTimeout(() => {
          clearNotification();
        }, 5000);
      }
    });

    const modalClear = ref(false);
    const type = ref(null);

    function confirmClear() {
      if (type.value === "delete") {
        store.dispatch("deleteMyAccount");
      } else if (type.value === "clear") {
        store.dispatch("clearAllKeys");
      }
      modalClear.value = false;
      type.value = null;
    }

    function cancelClear() {
      modalClear.value = false;
      type.value = null;
    }

    function deleteMyAccount() {
      type.value = "delete";
      modalClear.value = true;
    }

    function clearAllKeys() {
      type.value = "clear";
      modalClear.value = true;
    }

    return {
      handlePasswordValidation,
      handleUsernameChange,
      handlePasswordChange,
      clearNotification,
      username,
      new_password,
      current_password,
      confirm_password,
      errors,
      messages,
      confirm,
      confirmUpdate,
      cancelUpdate,
      updatePasswordForm,
      clearAllKeys,
      modalClear,
      cancelClear,
      confirmClear,
      deleteMyAccount,
    };
  },
};
</script>

<style lang="sass" scoped>
@import "../sass/colors", "../sass/typography"
.page-container
  min-height: 100%
  display: block
  .page-header
    padding-top: 1em
    text-align: center
    .page-title
      color: $primary-dark
  .page-content
    max-width: 750px
    margin: 3em auto
    display: grid
    gap: 1em
    align-items: stretch
    grid-template-areas: 'welcome welcome don don' 'pw pw user user' 'pw pw rz rz'
    .section
      background: $gray-lighter
      border-radius: 5px
      box-shadow: 0 10px 20px rgba($gray, 0.1)
      padding: 2em 2.5em
      min-width: 360px
      &.user-brief
        grid-area: welcome
        .greeting
          color: $primary
          font-weight: 500
          font-size: $font-large
        .keys-state
          color: $gray
          font-size: $font-small
        .version
          margin-top: 0.5em
          display: block
          color: rgb(200,200,200)
          font-size: 0.7em
          font-weight: 500
      &.user-username
        grid-area: user
      &.user-password
        grid-area: pw
      &.user-username,
      &.user-password
        .user-form
          &:first-child
            margin-bottom: 1.5em
          .form-title
            display: block
            font-weight: 700
            color: $black
            font-size: $font-base
            padding-bottom: 0.5em
            border-bottom: 2px solid rgba($gray, 0.2)
          .cta
            margin-top: 1em
          .strength
            width: 100%
            display: flex
            justify-content: space-between
            align-items: center
            margin-top: 1em
            .block
              position: relative
              padding-top: 0.2em
              transition: color 0.3s ease-in-out
              &::before
                content: " "
                width: 100%
                height: 2.3px
                border-radius: 1px
                position: absolute
                top: 0
                right: 0
                transition: background 0.3s ease-in-out
              &.success
                color: $success
                &::before
                  background-color: $success
              &.fail
                color: $error
                &::before
                  background-color: $error
              .name
                font-weight: 700
                font-size: $font-smaller
      &.donation
        grid-area: don
      &.red-zone
        grid-area: rz
        background: rgba($secondary-light, 0.3)
        display: flex
        flex-direction: column
        align-items: flex-start
        justify-content: center
        .desc
          font-size: $font-small
          margin-bottom: 1em
          color: $secondary-dark
        .cta
          width: 100%
          display: flex
          align-items: center
          justify-content: space-between
</style>
