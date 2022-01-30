import { createConnection } from "typeorm";
import KeyEntity from "./Entities/Key.entity";
import UserEntity from "./Entities/User.entity";
import AppEntity from "./Entities/App.entity";
import { app } from "electron";
import logTxt from "../log";

const db = async () => {
  try {
    const userHome = app.getPath("userData");
    const appHome = `${userHome}/3SP/db/`;
    const dbFile = "3sp.db";
    let dbPath = `${appHome}${dbFile}`;

    const connection = await createConnection({
      type: "sqlite",
      synchronize: true,
      database: dbPath,
      autoSave: true,
      entities: [KeyEntity, UserEntity, AppEntity],
    });

    return {
      User: connection.getRepository(UserEntity),
      Key: connection.getRepository(KeyEntity),
      App: connection.getRepository(AppEntity),
    };
  } catch (err) {
    logTxt(err);
  }
};

export default db;
