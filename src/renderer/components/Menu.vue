<template>
  <nav class="topNavigation">
    <ul class="navList">
      <li class="navItem" v-if="isLogged">
        <a class="navLink" @click="logout">Logout</a>
      </li>
      <li class="navItem">
        <router-link class="navLink" exact-active-class="active" to="/"
          >My Keys</router-link
        >
      </li>
      <li class="navItem">
        <router-link class="navLink" active-class="active" to="/create"
          >Add new key</router-link
        >
      </li>
      <li class="navItem">
        <router-link class="navLink" active-class="active" to="/import"
          >Import keys</router-link
        >
      </li>
      <li class="navItem">
        <router-link class="navLink" active-class="active" to="/export"
          >Export keys</router-link
        >
      </li>
      <li class="navItem">
        <router-link class="navLink" active-class="active" to="/settings"
          >Settings</router-link
        >
      </li>
      <li class="navItem">
        <router-link class="navLink" active-class="active" to="/about"
          >About</router-link
        >
      </li>
    </ul>
  </nav>
</template>

<script>
import { useStore } from "vuex";
import { computed } from "vue";

export default {
  name: "Menu",
  setup() {
    const store = useStore();

    const isLogged = computed(() => {
      return store.getters.logState;
    });

    function logout() {
      store.dispatch("logoutUser");
    }

    return { isLogged, logout };
  },
};
</script>

<style lang="scss" scoped>
@import "../sass/colors", "../sass/typography";

.topNavigation {
  width: 100%;
  background: $white;

  .navList {
    list-style: none;
    display: flex;
    justify-content: center;
    align-items: center;
    .navItem {
      .navLink {
        position: relative;
        display: block;
        padding: 0.8em 1.2em;
        color: $black;
        font-size: 0.8em;
        text-decoration: none;
        font-weight: 500;
        cursor: pointer;
        transition: 0.2s ease-in;
        &::after {
          content: " ";
          position: absolute;
          bottom: 0;
          left: 0;
          width: 0;
          height: 2px;
          background: $secondary;
          transition: 0.2s ease-in;
        }

        &:hover,
        &:active {
          font-weight: 600;
          &::after {
            width: 50%;
            left: 5px;
          }
        }

        &.active {
          color: $secondary;
          font-weight: 600;
          border-bottom-left-radius: 0;
          &::after {
            width: 100%;
            left: 0;
          }
        }
      }
    }
  }
}
</style>
