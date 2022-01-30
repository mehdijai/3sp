import { EntitySchema } from "typeorm";

export default new EntitySchema({
  name: "Key", // Will use table name `category` as default behaviour.
  tableName: "keys", // Optional: Provide `tableName` property to override the default behaviour for table name.
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
    name: {
      type: "varchar",
    },
    description: {
      type: "text",
      nullable: true,
    },
    key: {
      type: "varchar",
    },
  },
  relations: {
    user: {
      target: "User",
      type: "many-to-one",
      joinColumn: true,
      cascade: true,
      onDelete: "CASCADE",
    },
  },
});
