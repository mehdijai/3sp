import logTxt from "../log";

let db, AppEncKey, keyEncryptor, keyDecryptor;

function init(dbInstance, AppEncKeyIns, keyEncryptorIns, keyDecryptorIns) {
  db = dbInstance;
  AppEncKey = AppEncKeyIns;
  keyEncryptor = keyEncryptorIns;
  keyDecryptor = keyDecryptorIns;

  return {
    register,
    get_user,
    updateUsername,
    updatePassword,
    DeleteUser,
  };
}

function valid(request) {
  return (
    request.username !== "" &&
    request.password !== "" &&
    request.password.length >= 16
  );
}
async function user_exists(username) {
  const user = await db.User.find({ username });
  return user.length > 0;
}
async function register(request) {
  if (valid(request)) {
    if ((await user_exists(request.username)) === false) {
      let uuid =
        String.fromCharCode(65 + Math.floor(Math.random() * 26)) + Date.now();
      let user = await db.User.create({
        uuid: uuid,
        username: request.username,
        password: request.password,
      });
      await db.User.save(user);

      return {
        status: true,
        data: {
          token: keyEncryptor(uuid, AppEncKey),
          username: request.username,
        },
      };
    } else {
      return await login(request);
    }
  } else {
    return { status: false, data: "Credentials are not valid!" };
  }
}

async function login(request) {
  let user = await db.User.findOne({
    username: request.username,
  });
  if (user.password !== request.password) {
    return { status: false, data: "Password is not correct!" };
  }
  if (user) {
    return {
      status: true,
      data: {
        token: keyEncryptor(user.uuid, AppEncKey),
        username: request.username,
      },
    };
  } else {
    return null;
  }
}

async function get_user(token) {
  try {
    let enc_uuid = keyDecryptor(token, AppEncKey);
    return await db.User.findOne({ uuid: enc_uuid });
  } catch (err) {
    logTxt("get_user: " + err);
  }
}

async function updateUsername(token, username) {
  try {
    let user = await get_user(token);
    if (user) {
      const existingUsername = await db.User.find({ username });
      if (existingUsername.length > 0) {
        return {
          status: false,
          data: "Username already exists",
        };
      }
      await db.User.update(user.id, { username });
      return {
        status: true,
        data: username,
      };
    } else {
      return {
        status: false,
        data: "You are not authorized to take this action",
      };
    }
  } catch (err) {
    logTxt("update_username: " + err);
  }
}

async function updatePassword(currentPW, newPW, token) {
  try {
    let user = await get_user(token);
    if (user) {
      if (user.password === currentPW) {
        user.password = newPW;
        await db.User.update(user.id, user);
        await updateKeys(user.id, currentPW, newPW);
        return {
          status: true,
          data: "Changed successfully",
        };
      } else {
        return {
          status: false,
          data: "Wrong password",
        };
      }
    } else {
      return {
        status: false,
        data: "You are not authorized to take this action",
      };
    }
  } catch (error) {
    return {
      status: false,
      data: error,
    };
  }
}

async function updateKeys(id, oldPW, newPW) {
  let keys = await db.Key.find({
    where: {
      user: { id },
    },
    select: ["id", "key"],
    relations: ["user"],
  });

  keys.forEach(async (key) => {
    key.key = keyDecryptor(key.key, oldPW);
    key.key = keyEncryptor(key.key, newPW);
    await db.Key.update(key.id, key);
  });
}

async function DeleteUser(user) {
  try {
    await db.User.delete(user.id);
    return {
      status: true,
      data: "Deleted Successfully",
    };
  } catch (err) {
    return {
      status: false,
      data: err,
    };
  }
}

export default init;
