import { fileDecryptor, keyEncryptor } from "../Encryption/encryptor";

async function fetchFileData(fileDir, key) {
  return await fileDecryptor(fileDir, key);
}

async function importKeys(selectedKeys, mode, user, db) {
  switch (mode.type) {
    case "duplicate":
      switch (mode.value) {
        case "name":
          selectedKeys.forEach(async (selectedKey) => {
            const existingKeys = await db.Key.find({ name: selectedKey.name });
            if (existingKeys.length > 0) {
              selectedKey.name = `${selectedKey.name} (${existingKeys.length})`;
            }
            selectedKey.uuid =
              String.fromCharCode(65 + Math.floor(Math.random() * 26)) +
              Date.now();
            selectedKey.user = user;
            const key = await db.Key.create(selectedKey);
            await db.Key.save(key);
          });
          break;
        case "description":
          selectedKeys.forEach(async (selectedKey) => {
            const existingKeys = await db.Key.find({
              description: selectedKey.description,
            });
            if (existingKeys.length > 0) {
              selectedKey.name = `${selectedKey.name} (${existingKeys.length})`;
              selectedKey.uuid =
                String.fromCharCode(65 + Math.floor(Math.random() * 26)) +
                Date.now();
            }
            selectedKey.user = user;
            const key = await db.Key.create(selectedKey);
            await db.Key.save(key);
          });
          break;
      }
      break;
    case "overwrite":
      switch (mode.value) {
        case "name":
          selectedKeys.forEach(async (selectedKey) => {
            const existingKey = await db.Key.findOne({
              name: selectedKey.name,
            });
            if (existingKey) {
              existingKey.name = selectedKey.name;
              existingKey.key = keyEncryptor(selectedKey.key, user.password);
              existingKey.description = selectedKey.description;
              await db.Key.update(existingKey.id, existingKey);
            } else {
              selectedKey.uuid =
                String.fromCharCode(65 + Math.floor(Math.random() * 26)) +
                Date.now();
              selectedKey.user = user;
              const key = await db.Key.create(selectedKey);
              await db.Key.save(key);
            }
          });
          break;
        case "description":
          selectedKeys.forEach(async (selectedKey) => {
            const existingKey = await db.Key.findOne({
              description: selectedKey.description,
            });
            if (existingKey) {
              existingKey.name = selectedKey.name;
              existingKey.key = keyEncryptor(selectedKey.key, user.password);
              existingKey.description = selectedKey.description;
              await db.Key.update(existingKey.id, existingKey);
            } else {
              selectedKey.uuid =
                String.fromCharCode(65 + Math.floor(Math.random() * 26)) +
                Date.now();
              selectedKey.user = user;
              const key = await db.Key.create(selectedKey);
              await db.Key.save(key);
            }
          });
          break;
      }
      break;
    case "keep_old":
      switch (mode.value) {
        case "name":
          selectedKeys.forEach(async (selectedKey) => {
            const existingKeys = await db.Key.find({ name: selectedKey.name });
            if (existingKeys.length === 0) {
              selectedKey.user = user;
              selectedKey.uuid =
                String.fromCharCode(65 + Math.floor(Math.random() * 26)) +
                Date.now();
              const key = await db.Key.create(selectedKey);
              await db.Key.save(key);
            }
          });
          break;
        case "description":
          selectedKeys.forEach(async (selectedKey) => {
            const existingKeys = await db.Key.find({
              description: selectedKey.description,
            });
            if (existingKeys.length === 0) {
              selectedKey.user = user;
              selectedKey.uuid =
                String.fromCharCode(65 + Math.floor(Math.random() * 26)) +
                Date.now();
              const key = await db.Key.create(selectedKey);
              await db.Key.save(key);
            }
          });
          break;
      }
      break;
    case "clear":
      await db.Key.clear();
      selectedKeys.forEach(async (selectedKey) => {
        selectedKey.user = user;
        const key = await db.Key.create(selectedKey);
        await db.Key.save(key);
      });
      break;
  }

  return {
    status: true,
    data: "Keys imported Successfully!",
  };
}

export { fetchFileData, importKeys };
