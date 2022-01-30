import { keyEncryptor, keyDecryptor } from "../Encryption/encryptor";

const KeysCRUD = {
  async Create(db, newKey, user, sort) {
    newKey.uuid =
      String.fromCharCode(65 + Math.floor(Math.random() * 26)) + Date.now();

    newKey.user = user;

    newKey.key = keyEncryptor(newKey.key, user.password);

    const key = await db.Key.create(newKey);
    await db.Key.save(key);

    return await this.Read(db, user, sort);
  },

  async Read(db, currentUser, sort = "DESC") {
    if (!currentUser) {
      return null;
    }
    let keys = await db.Key.find({
      where: {
        user: { id: currentUser.id },
      },
      order: {
        id: sort,
      },
      relations: ["user"],
    });

    keys.map((key) => {
      key.key = keyDecryptor(key.key, currentUser.password);
      delete key.user;
      return key;
    });

    return JSON.stringify(keys);
  },

  async Update(db, uuid, newKey, user, sort) {
    newKey.key = keyEncryptor(newKey.key, user.password);
    await db.Key.update({ uuid }, newKey);

    return await this.Read(db, user, sort);
  },

  async Delete(db, uuid, user, sort) {
    await db.Key.delete({ uuid });

    return await this.Read(db, user, sort);
  },

  async Clear(db, user) {
    if (!user) {
      return {
        status: false,
        data: "You are not authorized to take this action",
      };
    }
    if (!db) {
      return {
        status: false,
        data: "There was an error in the database! restart the app",
      };
    }
    try {
      await db.Key.delete({ user });
      return {
        status: true,
        data: "All the keys are deleted successfully",
      };
    } catch (err) {
      return {
        status: false,
        data: err,
      };
    }
  },
};

export default KeysCRUD;
