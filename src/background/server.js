import { app, ipcMain, shell } from "electron";
import dbConfig from "./db/db.config";
import { keyEncryptor, keyDecryptor } from "./Encryption/encryptor";
import exportKeys from "./Share/export-keys";
import { fetchFileData, importKeys } from "./Share/import-keys";
import { setAppEncKey, getAppEncKey } from "./Encryption/app-encryption-key";
import Auth from "./db/auth";
import KeysCRUD from "./db/api";

const server = async () => {
  const db = await dbConfig();
  await setAppEncKey(db.App);

  const { register, get_user, updateUsername, updatePassword, DeleteUser } =
    Auth(db, await getAppEncKey(db.App), keyEncryptor, keyDecryptor);

  ipcMain.handle("app-version", () => {
    return app.getVersion();
  });

  ipcMain.handle("get-keys", async (event, { token, sort }) => {
    const result = await KeysCRUD.Read(db, await get_user(token), sort);
    return result;
  });

  ipcMain.handle("create-key", async (event, { newKey, token, sort }) => {
    const result = await KeysCRUD.Create(
      db,
      newKey,
      await get_user(token),
      sort
    );
    return result;
  });

  ipcMain.handle("update-key", async (event, { uuid, newKey, token, sort }) => {
    const result = await KeysCRUD.Update(
      db,
      uuid,
      newKey,
      await get_user(token),
      sort
    );
    return result;
  });

  ipcMain.handle("delete-key", async (event, { uuid, token, sort }) => {
    const result = await KeysCRUD.Delete(db, uuid, await get_user(token), sort);
    return result;
  });

  ipcMain.handle("register", async (event, userData) => {
    return await register(userData);
  });

  ipcMain.handle("update-username", async (event, { token, newUsername }) => {
    return await updateUsername(token, newUsername);
  });

  ipcMain.handle(
    "update-password",
    async (event, { currentPW, newPW, token }) => {
      return await updatePassword(currentPW, newPW, token);
    }
  );

  ipcMain.handle("open-export-path-dialog", async () => {
    const { dialog } = require("electron");

    let dir = await dialog.showOpenDialog({
      properties: ["openDirectory", "createDirectory "],
    });

    if (!dir.canceled) {
      return dir.filePaths[0];
    } else {
      return null;
    }
  });

  ipcMain.handle("export-keys", async (event, { dirPath, token }) => {
    if (dirPath === "" || typeof dirPath !== "string") {
      return {
        status: false,
        data: "Directory path should be a string and not empty!",
      };
    }
    if (!token) {
      return {
        status: false,
        data: "You are not allowed to make this action! close the application, re-log and try again.",
      };
    }
    const user = await get_user(token);
    if (!user) {
      return {
        status: false,
        data: "You are not allowed to make this action! close the application, re-log and try again.",
      };
    }

    return await exportKeys(dirPath, user, db.Key);
  });

  ipcMain.handle(
    "open-import-file-dialog",
    async (event, { token, filePath }) => {
      try {
        let response = {
          status: false,
          data: null,
        };
        if (filePath === null) {
          const { dialog } = require("electron");

          let dir = await dialog.showOpenDialog({
            properties: ["openFile"],
          });

          if (!dir.canceled) {
            let extension = dir.filePaths[0].split(".")[1];
            if (extension.toLowerCase() === "3sp") {
              let key = (await get_user(token)).password;
              response.status = true;
              response.data = JSON.parse(
                await fetchFileData(dir.filePaths[0], key)
              );
            } else {
              response.status = false;
              response.data =
                "This file is not .3sp file! Import the correct file please.";
            }
          }
        } else {
          let extension = filePath.split(".")[1];
          if (extension.toLowerCase() === "3sp") {
            let key = (await get_user(token)).password;
            response.status = true;
            response.data = JSON.parse(await fetchFileData(filePath, key));
          } else {
            response.status = false;
            response.data =
              "This file is not .3sp file! Import the correct file please.";
          }
        }
        return response;
      } catch (err) {
        return {
          status: false,
          data: "This file was exported by another user with a different password. Login with that same password to be able to import this data",
        };
      }
    }
  );

  ipcMain.handle(
    "save-imported-keys",
    async (event, { selectedKeys, mode, token }) => {
      const modes = ["duplicate", "overwrite", "keep_old", "clear"];
      const vals = ["name", "description"];

      if (selectedKeys.length <= 0) {
        return {
          status: false,
          data: "There is no selected keys!",
        };
      }
      if (!modes.includes(mode.type)) {
        return {
          status: false,
          data: "The selected mode identifier is not allowed.",
        };
      }
      if (!vals.includes(mode.value)) {
        return {
          status: false,
          data: "The selected mode is not allowed.",
        };
      }
      const user = await get_user(token);
      if (!user) {
        return {
          status: false,
          data: "You are not allowed to take this action! Please login.",
        };
      }

      return await importKeys(selectedKeys, mode, user, db);
    }
  );

  ipcMain.handle("clear-all-keys", async (event, token) => {
    return await KeysCRUD.Clear(db, await get_user(token));
  });

  ipcMain.handle("delete-my-account", async (event, token) => {
    return await DeleteUser(await get_user(token));
  });

  ipcMain.on("support-donate", () => {
    shell.openExternal("https://www.buymeacoffee.com/mehdi.j");
  });
};

export { server };
