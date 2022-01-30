import { EntitySchema } from "typeorm";

export default new EntitySchema({
  name: "App", // Will use table name `category` as default behaviour.
  tableName: "app", // Optional: Provide `tableName` property to override the default behaviour for table name.
  columns: {
    id: {
      primary: true,
      type: "int",
      generated: true,
    },
    name: {
      type: "varchar",
    },
    value: {
      type: "varchar",
    },
  },
});
