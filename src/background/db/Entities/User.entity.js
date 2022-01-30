import { EntitySchema } from "typeorm";

export default new EntitySchema({
  name: "User",
  tableName: "users",
  columns: {
    id: {
      primary: true,
      type: "int",
      generated: true,
    },
    uuid: {
      unique: true,
      type: "varchar",
    },
    username: {
      unique: true,
      type: "varchar",
    },
    password: {
      type: "varchar",
    },
  },
  relations: {
    keys: {
      target: "Key",
      type: "one-to-many",
      joinColumn: true,
    },
  },
});
