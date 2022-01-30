const { contextBridge, ipcRenderer } = require("electron");

const validChannels = [
  "get-keys", // ? returns keys
  "delete-key", // ? returns keys
  "create-key", // ? returns keys
  "update-key", // ? returns keys
  "register", // ? returns status || token and username
  "open-export-path-dialog", // ? returns export path
  "export-keys", // ? returns status
  "open-import-file-dialog", // ? return imported keys
  "save-imported-keys", // ? returns status
  "update-username", // ? returns updated username
  "update-password", // ? returns status
  "support-donate", // ? void
  "clear-all-keys", // ? return status
  "delete-my-account", // ? return status
  "app-version", // ? return version
  "restart-app",
  "update-ready",
];

contextBridge.exposeInMainWorld("ipc", {
  send: (channel, data) => {
    if (validChannels.includes(channel)) {
      ipcRenderer.send(channel, data);
    }
  },
  invoke: (channel, args) => {
    if (validChannels.includes(channel)) {
      return ipcRenderer.invoke(channel, args);
    }
  },
  sendSync: (channel, data) => {
    if (validChannels.includes(channel)) {
      return ipcRenderer.sendSync(channel, data);
    }
  },
  on: (channel, func) => {
    if (validChannels.includes(channel)) {
      ipcRenderer.on(channel, (event, ...args) => func(...args));
    }
  },
  desktopDir: () => {
    const homeDir = require("os").homedir();
    return `${homeDir}\\Desktop`;
  },
});
