<template>
  <Menu />
  <div class="keysListPage">
    <header class="keysListPageHeader">
      <Logo />
      <Separator />
    </header>
    <section class="keysListPageBody">
      <div v-if="keys.length === 0 && search === ''" class="emptyState">
        <img
          class="image"
          src="../assets/not_found.svg"
          alt="Empty keys list!"
        />
        <h1 class="title">The list still fresh!</h1>
        <div class="cta">
          <Button @click="$router.push({ name: 'create' })" mode="primary"
            >Add a new key</Button
          >
          <Button @click="$router.push({ name: 'import' })" mode="primary-ghost"
            >Import keys</Button
          >
        </div>
      </div>
      <div v-else class="content">
        <header class="searchForm">
          <SearchInput v-model="search" @submit="clearSearch" />
          <span
            @click="setView('grid')"
            v-if="view !== 'grid'"
            class="view-icon material-icons"
            >apps</span
          >
          <span v-else @click="setView('list')" class="view-icon material-icons"
            >reorder</span
          >
          <span
            @click="setSort('DESC')"
            v-if="sort !== 'DESC'"
            class="view-icon material-icons"
            >arrow_upward</span
          >
          <span v-else @click="setSort('ASC')" class="view-icon material-icons"
            >arrow_downward</span
          >
        </header>
        <span class="title">
          {{ username }} secret keys:
          <strong class="count">{{ loading ? 0 : keys.length }}</strong>
        </span>

        <p class="not-found" v-if="keys.length === 0 && search !== ''">
          No key matches the search! Check the search query <br />
          or
          <router-link class="link" to="/register"
            >Create a new key</router-link
          >
        </p>

        <div v-if="view === 'grid'" class="grid-keys">
          <template v-if="loading">
            <div v-for="i in 4" :key="i" class="key-item-grid__skeleton"></div>
          </template>
          <template v-else>
            <KeyItemGrid
              v-for="key in keys"
              :key="key.uuid"
              :keyItem="key"
              :displayed="displayed"
              @show="showKey"
            />
          </template>
        </div>

        <ul v-if="view === 'list'" class="keys">
          <template v-if="loading">
            <li class="keysItem" v-for="i in 4" :key="i">
              <div class="key-item-list_skeleton"></div>
            </li>
          </template>
          <template v-else>
            <li class="keysItem" v-for="key in keys" :key="key.uuid">
              <KeyItem :keyItem="key" :displayed="displayed" @show="showKey" />
            </li>
          </template>
        </ul>

        <span
          @click="$router.push({ name: 'create' })"
          class="fab material-icons"
          >add</span
        >
      </div>
    </section>
  </div>
</template>

<script>
import KeyItemGrid from "../components/KeyItemGrid.vue";

import { ref, computed } from "vue";
import { useStore } from "vuex";
import {
  Menu,
  Logo,
  Separator,
  Button,
  SearchInput,
} from "../components/Components.js";
import KeyItem from "../components/KeyItem.vue";

export default {
  name: "KeysListPage",
  components: {
    Menu,
    Logo,
    Separator,
    KeyItem,
    Button,
    SearchInput,
    KeyItemGrid,
  },
  setup() {
    const store = useStore();
    store.dispatch("readKeys");

    const search = ref("");

    const keys = computed(() => {
      return store.getters.keys.filter((key) => {
        if (key != null) {
          return (
            key.name.toLowerCase().includes(search.value.toLowerCase()) ||
            key.description
              .toLowerCase()
              .includes(search.value.toLowerCase()) ||
            key.key.toLowerCase().includes(search.value.toLowerCase())
          );
        } else {
          return true;
        }
      });
    });

    function clearSearch() {
      search.value = "";
    }

    const displayed = ref(null);
    function showKey(uuid) {
      displayed.value = uuid;
    }

    const view = computed(() => {
      return store.getters.keys_view;
    });

    function setView(type) {
      store.commit("setView", type);
    }

    const sort = computed(() => {
      return store.getters.sort;
    });

    function setSort(type) {
      store.dispatch("sortRead", type);
    }

    const loading = computed(() => {
      return store.getters.loading;
    });

    const username = computed(() => {
      return store.getters.username;
    });

    return {
      keys,
      search,
      clearSearch,
      displayed,
      showKey,
      setView,
      view,
      sort,
      setSort,
      loading,
      username,
    };
  },
};
</script>

<style lang="scss" scoped>
@import "../sass/colors", "../sass/typography";

.keysListPage {
  min-height: calc(100vh - 66.88px);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 3em 0;

  .keysListPageHeader {
    display: flex;
    flex-direction: column;
    align-items: center;
    row-gap: 1em;
  }

  .keysListPageBody {
    .emptyState {
      text-align: center;
      .image {
        margin-bottom: 2em;
      }
      .title {
        margin-bottom: 0.2em;
        font-size: $font-largest;
        font-weight: 900;
        color: $secondary;
      }
      .cta {
        display: flex;
        justify-content: center;
        column-gap: 1em;
      }
    }
    .content {
      width: 700px;
      .searchForm {
        margin: 0 auto 2em auto;
        width: 350px;
        display: flex;
        column-gap: 0.8em;
        align-items: baseline;
        justify-content: center;

        *:first-child {
          width: 100%;
        }

        .view-icon {
          transform: translateY(calc(25% - 0.15em));
          background: $gray-lighter;
          color: $primary;
          padding: 0.3em;
          font-size: 1.3em;
          border-radius: 5px;
          cursor: pointer;
          transition: 0.2s ease-in;

          &:hover {
            background: rgba($primary-light, 0.2);
          }
        }
      }
      .title {
        font-size: 1.2em;
        font-weight: 500;
        color: lighten($black, 15);
        padding-bottom: 0.3em;
        padding-right: 1.5em;
        border-bottom: 2px solid lighten($black, 50);
        margin-bottom: 0.5em;
        display: inline-block;
        .count {
          color: $secondary;
        }
      }
      .keys {
        margin-top: 0.5em;
        list-style: none;
        .keysItem {
          .key-item-list_skeleton {
            width: 700px;
            height: 70px;
            margin: 1em 0;
            background-image: linear-gradient(
              90deg,
              rgba($gray, 0.4) 0,
              rgba($gray, 0.2) 70px,
              rgba($gray, 0.4) 200px
            );
            background-size: 1200px;
            animation: list-skeleton 1.6s infinite linear;
            border-radius: 5px;
          }
        }
      }
      .not-found {
        text-align: center;
        margin-top: 2em;
        font-size: $font-large;
        font-weight: 700;
        color: $black;

        .link {
          text-decoration: none;
          color: $secondary;
        }
      }
      .grid-keys {
        margin-top: 1em;
        width: 100%;
        display: grid;
        grid-template-columns: repeat(3, 220px);
        column-gap: 20px;
        row-gap: 20px;
        align-items: stretch;
        .key-item-grid__skeleton {
          width: 220px;
          height: 150px;
          background-image: linear-gradient(
            90deg,
            rgba($gray, 0.4) 0,
            rgba($gray, 0.2) 70px,
            rgba($gray, 0.4) 200px
          );
          background-size: 600px;
          animation: grid-skeleton 1.6s infinite ease-out;
          border-radius: 5px;
        }
      }
      .fab {
        background: $primary;
        color: $white;
        font-size: 1.8em;
        padding: 0.3em;
        border-radius: 100%;
        position: fixed;
        z-index: 100;
        top: 0.5em;
        right: 0.5em;
        cursor: pointer;
        box-shadow: 0 10px 20px rgba($gray, 0.6);
        transition: 0.2s ease-in-out;

        &:hover {
          background: $primary-dark;
          transform: rotateZ(20deg);
        }

        &:active {
          transform: translateY(5px);
        }
      }
    }
  }
}

@keyframes grid-skeleton {
  0% {
    background-position: -40px;
  }
  50%,
  100% {
    background-position: 200px;
  }
}
@keyframes list-skeleton {
  0% {
    background-position: -100px;
  }
  50%,
  100% {
    background-position: 700px;
  }
}
</style>
