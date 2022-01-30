import { createStore } from "vuex";
import router from "../router/index";

export default createStore({
  state: {
    keys: [null],
    KeysView:
      window.localStorage.getItem(
        "key_view__" + window.localStorage.getItem("3splt")
      ) || "list",
    isLogged: !["null", "undefined", null, undefined].includes(
      window.localStorage.getItem("3splt")
    ),
    loading: false,
    error: null,
    username:
      window.localStorage.getItem(
        "username__" + window.localStorage.getItem("3splt")
      ) || "",
    dirPath:
      window.localStorage.getItem(
        "dir_path__" + window.localStorage.getItem("3splt")
      ) || window.ipc.desktopDir(),
    imported: null,
    saving: null,
    sort:
      window.localStorage.getItem(
        "sort__" + window.localStorage.getItem("3splt")
      ) || "DESC",
    keysCount:
      window.localStorage.getItem(
        "keys_count__" + window.localStorage.getItem("3splt")
      ) || 0,
    appVersion: null,
  },
  mutations: {
    setAppVersion(state, version) {
      state.appVersion = version;
    },
    setKeys(state, keys) {
      if (keys === null) {
        window.localStorage.removeItem("3splt");
        window.localStorage.removeItem(
          "username__" + window.localStorage.getItem("3splt")
        );
        router.replace({ name: "register" });
        state.loading = false;
      } else {
        state.keys = JSON.parse(keys);
        window.localStorage.setItem(
          "keys_count__" + window.localStorage.getItem("3splt"),
          JSON.parse(keys).length
        );
        state.keysCount = JSON.parse(keys).length;
        state.loading = false;
      }
    },
    setView(state, value) {
      const allowed = ["grid", "list"];

      if (allowed.includes(value)) {
        state.KeysView = value;
        window.localStorage.setItem(
          "key_view__" + window.localStorage.getItem("3splt"),
          value
        );
      }
    },
    setError(state, value) {
      state.error = value;
    },
    loading(state) {
      state.loading = true;
    },
    loaded(state) {
      state.loading = false;
    },
    setUsername(state, data) {
      state.username = data;
    },
    setLoggedState(state, value) {
      state.isLogged = value;
    },
    setDirPath(state, value) {
      state.dirPath = value;
    },
    clearError(state) {
      state.error = null;
    },
    importNewKeys(state, data) {
      state.imported = data;
    },
    cancelImport(state) {
      state.imported = null;
    },
    setSavingState(state, data) {
      state.saving = data;
    },
    setSort(state, value) {
      state.sort = value;
    },
  },
  actions: {
    getAppVersion: async (context) => {
      context.commit("setAppVersion", await window.ipc.invoke("app-version"));
    },
    sortRead: async (context, value) => {
      const allowed = ["DESC", "ASC"];
      if (allowed.includes(value)) {
        context.commit("setSort", value);
        await context.dispatch("readKeys");
      }
    },
    readKeys: async (context) => {
      context.commit("loading");
      const data = {
        token: window.localStorage.getItem("3splt"),
        sort: context.state.sort,
      };
      context.commit("setKeys", await window.ipc.invoke("get-keys", data));
    },
    deleteKey: async (context, uuid) => {
      const data = {
        uuid,
        token: window.localStorage.getItem("3splt"),
        sort: context.state.sort,
      };
      context.commit("loading");
      context.commit("setKeys", await window.ipc.invoke("delete-key", data));
    },
    createKey: async (context, newKey) => {
      const data = {
        newKey,
        token: window.localStorage.getItem("3splt"),
        sort: context.state.sort,
      };
      context.commit("loading");
      context.commit("setKeys", await window.ipc.invoke("create-key", data));
    },
    updateKey: async (context, udata) => {
      const data = {
        ...udata,
        token: window.localStorage.getItem("3splt"),
        sort: context.state.sort,
      };
      context.commit("loading");
      context.commit("setKeys", await window.ipc.invoke("update-key", data));
    },
    registerUser: async (context, data) => {
      context.commit("loading");
      const res = await window.ipc.invoke("register", data);
      if (res.status === true) {
        window.localStorage.setItem("3splt", res.data.token);
        window.localStorage.setItem(
          "username__" + window.localStorage.getItem("3splt"),
          res.data.username
        );
        context.commit("setUsername", res.data.username);
        context.commit("setLoggedState", true);
        router.replace({ name: "keys-list" });
      } else {
        context.commit("setError", res.data);
      }
      context.commit("loaded");
    },
    logoutUser: (context) => {
      context.commit("loading");
      window.localStorage.removeItem("3splt");
      router.replace({ name: "register" });
      window.localStorage.removeItem(
        "username__" + window.localStorage.getItem("3splt")
      );
      context.commit("setUsername", "");
      context.commit("setLoggedState", false);
      context.commit("loaded");
    },
    selectExportDirectory: async (context) => {
      let dirPath = await window.ipc.invoke("open-export-path-dialog");
      if (dirPath !== null) {
        window.localStorage.setItem(
          "dir_path__" + window.localStorage.getItem("3splt"),
          dirPath
        );
        context.commit("setDirPath", dirPath);
      }
    },
    exportKeys: async (context, dirPath) => {
      context.commit("loading");
      const res = await window.ipc.invoke("export-keys", {
        dirPath,
        token: window.localStorage.getItem("3splt"),
      });
      context.commit("setError", res);
      context.commit("loaded");
    },
    selectImportFile: async (context, filePath) => {
      context.commit("loading");
      const res = await window.ipc.invoke("open-import-file-dialog", {
        token: window.localStorage.getItem("3splt"),
        filePath,
      });
      if (res.status === true) {
        context.commit("importNewKeys", res.data);
      } else {
        context.commit("setError", res);
      }
      context.commit("loaded");
    },
    importKeys: async (context, { selectedKeys, mode }) => {
      const modes = ["duplicate", "overwrite", "keep_old", "clear"];
      const values = ["name", "description"];

      context.commit("loading");
      context.commit("clearError");
      if (!modes.includes(mode.type)) {
        context.commit("setError", {
          status: false,
          data: "The selected mode is not allowed.",
        });
        return;
      }
      if (!values.includes(mode.value)) {
        context.commit("setError", {
          status: false,
          data: "The selected mode identifier is not allowed.",
        });
        return;
      }

      if (selectedKeys.length <= 0) {
        context.commit("setError", {
          status: false,
          data: "You have to select at least one key to be able to import",
        });
        return;
      }

      const imported = JSON.parse(JSON.stringify(context.getters.imported));
      let selected = imported.filter((key) => {
        return selectedKeys.includes(key.uuid);
      });

      selected = selected.map((key) => {
        delete key.selected;
        return key;
      });

      const data = {
        selectedKeys: selected,
        mode: JSON.parse(JSON.stringify(mode)),
        token: window.localStorage.getItem("3splt"),
      };

      const res = await window.ipc.invoke("save-imported-keys", data);
      context.commit("setError", res);
      context.commit("loaded");
    },
    updateUsername: async (context, newUsername) => {
      context.commit("loading");
      context.commit("clearError");
      if (newUsername !== "") {
        const res = await window.ipc.invoke("update-username", {
          token: window.localStorage.getItem("3splt"),
          newUsername,
        });

        if (res.status === true) {
          window.localStorage.setItem(
            "username__" + window.localStorage.getItem("3splt"),
            res.data
          );
          context.commit("setUsername", res.data);
          context.commit("setError", {
            type: "success",
            message: "Username updated successfully",
          });
        } else {
          context.commit("setError", {
            type: "error",
            message: res.data,
          });
        }
      }
      context.commit("loaded");
    },
    updatePassword: async (context, data) => {
      context.commit("loading");

      let resp = {
        ...data, // current, new
        token: window.localStorage.getItem("3splt"),
      };

      const res = await window.ipc.invoke("update-password", resp);

      context.commit("setError", {
        type: res.status ? "success" : "error",
        message: res.data,
      });

      context.commit("loaded");
    },
    supportDonate: () => {
      window.ipc.send("support-donate");
    },
    clearAllKeys: async (context) => {
      context.commit("loading");
      const res = await window.ipc.invoke(
        "clear-all-keys",
        window.localStorage.getItem("3splt")
      );

      context.commit("setError", {
        type: res.status ? "success" : "error",
        message: res.data,
      });
      context.commit("loaded");
    },
    deleteMyAccount: async (context) => {
      context.commit("loading");
      const res = await window.ipc.invoke(
        "delete-my-account",
        window.localStorage.getItem("3splt")
      );

      if (res.status === false) {
        context.commit("setError", {
          type: res.status ? "success" : "error",
          message: res.data,
        });
      } else {
        window.localStorage.removeItem(
          "username__" + window.localStorage.getItem("3splt")
        );
        window.localStorage.removeItem(
          "key_view__" + window.localStorage.getItem("3splt")
        );
        window.localStorage.removeItem(
          "keys_count__" + window.localStorage.getItem("3splt")
        );
        window.localStorage.removeItem(
          "dir_path__" + window.localStorage.getItem("3splt")
        );
        window.localStorage.removeItem(
          "sort__" + window.localStorage.getItem("3splt")
        );
        window.localStorage.removeItem("3splt");
        router.replace({ name: "register" });
        context.commit("setLoggedState", false);
      }

      context.commit("loaded");
    },
  },
  getters: {
    keys: (state) => {
      return state.keys;
    },
    getKey: (state) => (uuid) => {
      return state.keys.find((key) => key.uuid === uuid);
    },
    keys_view: (state) => {
      return state.KeysView;
    },
    dirPath: (state) => {
      return state.dirPath;
    },
    loading: (state) => {
      return state.loading;
    },
    imported: (state) => {
      return state.imported;
    },
    errors: (state) => {
      return state.error;
    },
    logState: (state) => {
      return state.isLogged;
    },
    username: (state) => {
      return state.username;
    },
    sort: (state) => {
      return state.sort;
    },
    keysCount: (state) => {
      return state.keysCount;
    },
    appVersion: (state) => {
      return state.appVersion;
    },
  },
});
