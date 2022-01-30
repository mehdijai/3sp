<template>
  <div ref="bmc" class="bmc" @click="activate">
    <span class="coffee">☕</span>
    <img src="../assets/bmc-logo-yellow.png" alt="BMC Logo" class="logo" />
    <span class="caption" v-html="message"></span>
  </div>
</template>

<script>
import { ref } from "vue";
import { useStore } from "vuex";
export default {
  name: "BMC",
  setup() {
    const store = useStore();
    const bmc = ref(null);
    const message = ref(
      "This app is free to use. Do you want to help supporting it?"
    );
    function activate() {
      bmc.value.classList.add("active");
      message.value =
        "Thank you for your support! <br/> <small>you will redirected to BMC page</small>";
      setTimeout(() => {
        store.dispatch("supportDonate");
      }, 1000);
    }

    return { bmc, message, activate };
  },
};
</script>

<style lang="sass" scoped>
.bmc
  display: flex
  align-items: center
  column-gap: 1em
  background: #fff
  color: #606060
  padding: 0.8em 1em
  border-radius: 5px
  box-shadow: 0 10px 20px rgba(#dcdcdc, 0.15)
  cursor: pointer
  transition: 0.3s ease
  overflow: hidden
  position: relative
  .coffee
    position: absolute
    z-index: 1
    top: 50%
    left: 0.4em
    font-size: 2em
    animation: coffee__in 0.5s ease-out forwards
    border-radius: 100%
    padding-bottom: 5px
    background: darken(#FFDD00, 5)
    display: none
  .logo
    height: 35px
    border-radius: 100%
    animation: logo__in 0.5s ease-out forwards
    transition: 0.5s ease-in

  .caption
    font-size: 0.8em
    font-weight: 500
  &:hover
    background: darken(#FFDD00, 2)
    color: #232323
    .logo
      transform: translateY(-2px)
      box-shadow: 0 5px 10px rgba(#606060, 0.1)
  &.active
    background: darken(#FFDD00, 2) !important
    color: #232323 !important
    .coffee
      display: block
    .logo
      animation: logo__out 0.6s ease-in forwards !important

@keyframes coffee__in
  from
    transform: translateY(5em)
    box-shadow: 0 1em 10px rgba(#606060, 0.1)
  to
    transform: translateY(-50%)
    box-shadow: 0 5px 10px rgba(#606060, 0.1)
@keyframes logo__in
  from
    transform: perspective(10000px) rotateX(45deg) translateY(-5em)
    box-shadow: 0 1em 10px rgba(#606060, 0.1)
  to
    transform: perspective(0) rotateX(0) translateY(0)
    box-shadow: 0 5px 10px rgba(#606060, 0.1)

@keyframes logo__out
  0%
    transform: perspective(10000px) rotateX(45deg)
    box-shadow: 0 1em 10px rgba(#606060, 0.1)
  50%
    transform: translateY(-3em)
    box-shadow: 0 1em 10px rgba(#606060, 0.1)
  100%
    transform: translateY(-5em)
</style>
