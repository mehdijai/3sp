import { fileEncryptor } from "../Encryption/encryptor";

async function getAllKeysData(userId, db) {
  let keys = await db.find({
    where: {
      user: { id: userId },
    },
    relations: ["user"],
  });
  keys.map((key) => {
    delete key.id;
    delete key.user;
    return key;
  });

  return keys;
}

async function exportDataFile(dirPath, user, db) {
  const keys = await getAllKeysData(user.id, db);
  if (keys.length === 0) {
    return { status: false, data: "You don't have any saved keys!" };
  }

  fileEncryptor(
    JSON.stringify(keys),
    `${dirPath}\\${Date.now()}.3sp`,
    user.password
  );

  return { status: true, data: "succeed!" };
}

export default exportDataFile;
